/**
 * IoT Network Simulation Engine
 * Sensors, Gateways, Messages, and Power Management
 */

export class SensorDevice {
    constructor(id, type, config = {}) {
        this.id = id;
        this.type = type; // 'temperature', 'humidity', 'motion', 'light'
        this.readingInterval = config.interval || 60; // seconds
        this.batteryCapacity = config.battery || 3000; // mAh
        this.currentBattery = this.batteryCapacity;
        this.powerConsumption = config.power || 50; // mW (active)
        this.transmitPower = config.transmitPower || 100; // mW
        this.range = config.range || 100; // meters
        this.position = config.position || { x: 0, y: 0 };

        this.state = 'ACTIVE'; // ACTIVE, SLEEP, DEAD
        this.lastReading = null;
        this.readingsCount = 0;
        this.transmissionsCount = 0;
        this.lastTransmitTime = 0;
    }

    tick(elapsedSeconds) {
        if (this.state === 'DEAD') return null;

        // Drain battery based on state
        const activePower = this.state === 'ACTIVE' ? this.powerConsumption : this.powerConsumption * 0.1;
        const powerDrain = (activePower / 1000) * (elapsedSeconds / 3600); // Convert to mAh
        this.currentBattery -= powerDrain;

        if (this.currentBattery <= 0) {
            this.state = 'DEAD';
            this.currentBattery = 0;
            return null;
        }

        // Generate reading at interval
        this.lastTransmitTime += elapsedSeconds;
        if (this.lastTransmitTime >= this.readingInterval && this.state === 'ACTIVE') {
            this.lastTransmitTime = 0;
            this.lastReading = this.generateReading();
            this.readingsCount++;
            return this.lastReading;
        }

        return null;
    }

    generateReading() {
        const sensorData = {
            temperature: { value: 20 + Math.random() * 15, unit: '°C', icon: '🌡️' },
            humidity: { value: 40 + Math.random() * 40, unit: '%', icon: '💧' },
            motion: { value: Math.random() > 0.7 ? 1 : 0, unit: 'detected', icon: '👁️' },
            light: { value: Math.random() * 1000, unit: 'lux', icon: '💡' }
        };

        return {
            sensorId: this.id,
            type: this.type,
            timestamp: Date.now(),
            ...sensorData[this.type]
        };
    }

    transmit(destination) {
        if (this.state === 'DEAD') return false;

        // Check range
        const distance = Math.sqrt(
            Math.pow(destination.position.x - this.position.x, 2) +
            Math.pow(destination.position.y - this.position.y, 2)
        );

        if (distance > this.range) return false;

        // Consume transmission power
        const transmitCost = (this.transmitPower / 1000) * (0.1 / 3600); // 100ms transmission
        this.currentBattery -= transmitCost;
        this.transmissionsCount++;

        return true;
    }

    getBatteryPercentage() {
        return (this.currentBattery / this.batteryCapacity) * 100;
    }

    getEstimatedLifetime() {
        if (this.state === 'DEAD') return 0;
        const avgPower = this.powerConsumption * 0.7; // Assume 70% active time
        const hoursRemaining = this.currentBattery / (avgPower / 1000);
        return hoursRemaining / 24; // days
    }
}

export class Gateway {
    constructor(id, config = {}) {
        this.id = id;
        this.protocol = config.protocol || 'MQTT';
        this.maxDevices = config.maxDevices || 50;
        this.processingPower = config.cpu || 1000; // MIPS
        this.bufferSize = config.buffer || 1024; // KB
        this.currentBuffer = 0;
        this.uplinkBandwidth = config.uplink || 1000; // Kbps
        this.position = config.position || { x: 0, y: 0 };

        this.connectedDevices = new Set();
        this.messagesReceived = 0;
        this.messagesForwarded = 0;
        this.droppedMessages = 0;
        this.messageQueue = [];
    }

    receiveMessage(message) {
        this.messagesReceived++;

        // Check buffer capacity
        const messageSize = message.size || 0.1; // KB
        if (this.currentBuffer + messageSize > this.bufferSize) {
            this.droppedMessages++;
            return false;
        }

        // Add to buffer and queue
        this.currentBuffer += messageSize;
        this.messageQueue.push(message);

        return true;
    }

    tick(elapsedSeconds) {
        // Process and forward messages
        const processRate = this.uplinkBandwidth / 8; // KB/s
        const canProcess = processRate * elapsedSeconds;

        let processed = 0;
        while (this.messageQueue.length > 0 && processed < canProcess) {
            const msg = this.messageQueue.shift();
            const msgSize = msg.size || 0.1;
            processed += msgSize;
            this.currentBuffer -= msgSize;
            this.messagesForwarded++;
        }
    }

    connectDevice(deviceId) {
        if (this.connectedDevices.size < this.maxDevices) {
            this.connectedDevices.add(deviceId);
            return true;
        }
        return false;
    }

    getUtilization() {
        return (this.currentBuffer / this.bufferSize) * 100;
    }

    getConnectedCount() {
        return this.connectedDevices.size;
    }
}

export class CloudServer {
    constructor(id, config = {}) {
        this.id = id;
        this.storageCapacity = config.storage || 10000; // GB
        this.currentStorage = 0;
        this.messagesReceived = 0;
        this.dataPoints = [];
    }

    receiveMessage(message) {
        this.messagesReceived++;

        // Store data point
        const dataSize = (message.size || 0.1) / 1024 / 1024; // Convert KB to GB
        this.currentStorage += dataSize;

        this.dataPoints.push({
            timestamp: Date.now(),
            source: message.source,
            type: message.payload?.type,
            value: message.payload?.value
        });

        // Keep only recent data points
        if (this.dataPoints.length > 1000) {
            this.dataPoints.shift();
        }
    }

    getStoragePercentage() {
        return (this.currentStorage / this.storageCapacity) * 100;
    }
}

export class Message {
    constructor(source, destination, payload, protocol = 'MQTT') {
        this.id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.source = source;
        this.destination = destination;
        this.payload = payload;
        this.protocol = protocol;
        this.timestamp = Date.now();
        this.hops = 0;
        this.delivered = false;

        // Calculate size based on protocol
        this.size = this.calculateSize();
    }

    calculateSize() {
        const payloadSize = JSON.stringify(this.payload).length / 1024; // KB

        const overhead = {
            'MQTT': 0.02,  // 20 bytes
            'CoAP': 0.01,  // 10 bytes
            'HTTP': 0.1    // 100 bytes
        };

        return payloadSize + (overhead[this.protocol] || 0.02);
    }
}
