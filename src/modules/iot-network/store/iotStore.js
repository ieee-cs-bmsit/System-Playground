import { create } from 'zustand';
import { SensorDevice, Gateway, CloudServer, Message } from '../simulation/IoTEngine';

const useIoTStore = create((set, get) => ({
    // Time
    currentTime: 0,
    isRunning: false,
    timeScale: 1, // 1 second = 1 real second

    // Devices
    sensors: [],
    gateways: [],
    cloud: null,

    // Messages
    activeMessages: [],

    // Metrics
    metrics: {
        // Network
        totalDevices: 0,
        activeDevices: 0,
        deadDevices: 0,

        // Data Flow
        messagesGenerated: 0,
        messagesDelivered: 0,
        messagesDropped: 0,
        deliveryRate: 100,

        // Power
        avgBatteryLevel: 100,
        totalPowerConsumed: 0,
        estimatedLifetime: 0,

        // Performance
        avgLatency: 0,
        throughput: 0,
        networkUtilization: 0,

        // Reliability
        uptime: 100,
        packetLoss: 0
    },

    // Actions
    initializeCloud: () => {
        const cloud = new CloudServer('cloud-1', { storage: 10000 });
        set({ cloud });
    },

    addSensor: (type, position) => {
        const id = `sensor_${type}_${Date.now()}`;
        const sensor = new SensorDevice(id, type, {
            interval: 60,
            battery: 3000,
            power: 50,
            transmitPower: 100,
            range: 150,
            position
        });

        set(state => ({
            sensors: [...state.sensors, sensor],
            metrics: {
                ...state.metrics,
                totalDevices: state.metrics.totalDevices + 1,
                activeDevices: state.metrics.activeDevices + 1
            }
        }));
    },

    addGateway: (protocol, position) => {
        const id = `gateway_${protocol}_${Date.now()}`;
        const gateway = new Gateway(id, {
            protocol,
            maxDevices: 50,
            buffer: 1024,
            uplink: 1000,
            position
        });

        set(state => ({ gateways: [...state.gateways, gateway] }));
    },

    // Simulation control
    play: () => set({ isRunning: true }),
    pause: () => set({ isRunning: false }),

    reset: () => set({
        currentTime: 0,
        isRunning: false,
        sensors: [],
        gateways: [],
        activeMessages: [],
        metrics: {
            totalDevices: 0,
            activeDevices: 0,
            deadDevices: 0,
            messagesGenerated: 0,
            messagesDelivered: 0,
            messagesDropped: 0,
            deliveryRate: 100,
            avgBatteryLevel: 100,
            totalPowerConsumed: 0,
            estimatedLifetime: 0,
            avgLatency: 0,
            throughput: 0,
            networkUtilization: 0,
            uptime: 100,
            packetLoss: 0
        }
    }),

    // Simulation tick
    tick: () => {
        if (!get().isRunning) return;

        const state = get();
        const elapsedSeconds = state.timeScale;

        // Tick all sensors
        const newMessages = [];
        state.sensors.forEach(sensor => {
            const reading = sensor.tick(elapsedSeconds);

            if (reading && state.gateways.length > 0) {
                // Find nearest gateway
                const gateway = state.gateways[0];

                if (sensor.transmit(gateway)) {
                    const message = new Message(sensor.id, gateway.id, reading, gateway.protocol);
                    newMessages.push(message);
                    gateway.receiveMessage(message);
                }
            }
        });

        // Tick all gateways
        state.gateways.forEach(gateway => {
            gateway.tick(elapsedSeconds);

            // Forward messages to cloud
            if (state.cloud && gateway.messagesForwarded > 0) {
                state.cloud.receiveMessage({ source: gateway.id, size: 0.1, payload: {} });
            }
        });

        // Update metrics
        const activeSensors = state.sensors.filter(s => s.state === 'ACTIVE' || s.state === 'SLEEP').length;
        const deadSensors = state.sensors.filter(s => s.state === 'DEAD').length;
        const avgBattery = state.sensors.reduce((sum, s) => sum + s.getBatteryPercentage(), 0) / (state.sensors.length || 1);

        const totalMessagesGenerated = state.sensors.reduce((sum, s) => sum + s.readingsCount, 0);
        const totalMessagesDelivered = state.gateways.reduce((sum, g) => sum + g.messagesForwarded, 0);
        const totalMessagesDropped = state.gateways.reduce((sum, g) => sum + g.droppedMessages, 0);

        const deliveryRate = totalMessagesGenerated > 0
            ? ((totalMessagesDelivered / totalMessagesGenerated) * 100)
            : 100;

        set({
            currentTime: state.currentTime + elapsedSeconds,
            activeMessages: [...state.activeMessages, ...newMessages].slice(-50),
            metrics: {
                ...state.metrics,
                activeDevices: activeSensors,
                deadDevices: deadSensors,
                avgBatteryLevel: avgBattery,
                messagesGenerated: totalMessagesGenerated,
                messagesDelivered: totalMessagesDelivered,
                messagesDropped: totalMessagesDropped,
                deliveryRate,
                packetLoss: totalMessagesGenerated > 0 ? (totalMessagesDropped / totalMessagesGenerated) * 100 : 0,
                throughput: totalMessagesDelivered / Math.max(state.currentTime, 1)
            }
        });
    }
}));

export default useIoTStore;
