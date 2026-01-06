/**
 * IoT Network Module - 20 Progressive Levels
 * Focus: Sensor Networks, MQTT Protocol, Battery Life, Wireless Communication, Edge Computing
 */

const IOT_NETWORK_LEVELS = [
    // ========== BEGINNER LEVELS (1-5) ==========
    {
        id: 'iot-1-first-sensor',
        title: 'First Sensor Network',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        module: 'iot-network',

        objective: {
            description: 'Deploy your first IoT sensor network',
            requirements: [
                'Add 3 temperature sensors',
                'Add 1 gateway',
                'Connect sensors to gateway',
                'Collect 100 readings'
            ]
        },

        constraints: {
            minComponents: 4,
            allowedComponents: ['temp-sensor', 'gateway', 'mqtt-broker'],
            requiredMetrics: {
                readingsCollected: { min: 100 }
            }
        },

        starRating: {
            3: { deliveryRate: { min: 98 } },
            2: { deliveryRate: { min: 95 } },
            1: { readingsCollected: { min: 100 } }
        },

        hints: [
            'Temperature sensors measure ambient temp',
            'Gateway aggregates sensor data',
            'Wireless communication',
            'Check battery levels'
        ],

        tutorialSteps: [
            'Drag 3 temperature sensors',
            'Add a gateway node',
            'Connect sensors to gateway',
            'Press play to collect data',
            'Watch readings accumulate'
        ],

        unlocks: 'iot-2-mqtt'
    },

    {
        id: 'iot-2-mqtt',
        title: 'MQTT Protocol Basics',
        difficulty: 'beginner',
        estimatedTime: '7 min',
        module: 'iot-network',

        objective: {
            description: 'Set up MQTT pub/sub communication',
            requirements: [
                'Add MQTT broker',
                'Sensors publish to topics',
                'Gateway subscribes',
                'Message delivery rate > 95%'
            ]
        },

        constraints: {
            minComponents: 5,
            requiredComponents: ['mqtt-broker'],
            requiredMetrics: {
                deliveryRate: { min: 95 }
            }
        },

        starRating: {
            3: { deliveryRate: { min: 99 } },
            2: { deliveryRate: { min: 97 } },
            1: { deliveryRate: { min: 95 } }
        },

        hints: [
            'MQTT = lightweight pub/sub protocol',
            'Broker handles message routing',
            'Topics organize messages',
            'QoS levels affect reliability'
        ],

        unlocks: 'iot-3-battery-life'
    },

    {
        id: 'iot-3-battery-life',
        title: 'Battery Life Optimization',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        module: 'iot-network',

        objective: {
            description: 'Maximize sensor battery life',
            challenge: 'Keep sensors alive!',
            requirements: [
                'Use sleep mode',
                'Reduce transmission frequency',
                'Battery life > 7 days',
                'Still collect 50+ readings/day'
            ]
        },

        constraints: {
            requiredMetrics: {
                batteryLifeDays: { min: 7 },
                readingsPerDay: { min: 50 }
            }
        },

        starRating: {
            3: { batteryLifeDays: { min: 30 } },
            2: { batteryLifeDays: { min: 14 } },
            1: { batteryLifeDays: { min: 7 } }
        },

        hints: [
            'Sleep mode saves power',
            'Duty cycle = active time ratio',
            'Transmission is most power-hungry',
            'Aggregate before sending'
        ],

        unlocks: 'iot-4-multiple-sensors'
    },

    {
        id: 'iot-4-multiple-sensors',
        title: 'Multi-Sensor Network',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        module: 'iot-network',

        objective: {
            description: 'Deploy network with multiple sensor types',
            requirements: [
                'Add temperature, humidity, and light sensors',
                'Each type on separate MQTT topic',
                'Collect 50 readings per sensor type',
                'Network uptime > 90%'
            ]
        },

        constraints: {
            minComponents: 8,
            sensorTypes: ['temp-sensor', 'humidity-sensor', 'light-sensor'],
            requiredMetrics: {
                networkUptime: { min: 90 },
                readingsPerType: { min: 50 }
            }
        },

        starRating: {
            3: { networkUptime: { min: 98 }, readingsPerType: { min: 100 } },
            2: { networkUptime: { min: 95 }, readingsPerType: { min: 75 } },
            1: { networkUptime: { min: 90 }, readingsPerType: { min: 50 } }
        },

        hints: [
            'Different sensors, different topics',
            'Temperature: /sensors/temp',
            'Humidity: /sensors/humidity',
            'Light: /sensors/light'
        ],

        unlocks: 'iot-5-mesh-network'
    },

    {
        id: 'iot-5-mesh-network',
        title: 'Mesh Network Topology',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        module: 'iot-network',

        objective: {
            description: 'Build mesh network for redundancy',
            challenge: 'Self-healing network!',
            requirements: [
                '6 sensors in mesh topology',
                'Multiple paths to gateway',
                'Handle 1 node failure',
                'Delivery rate > 90%'
            ]
        },

        constraints: {
            minComponents: 7,
            topology: 'mesh',
            requiredMetrics: {
                deliveryRate: { min: 90 },
                pathRedundancy: { min: 2 }
            }
        },

        starRating: {
            3: { deliveryRate: { min: 95 }, nodeFailuresTolerated: { min: 2 } },
            2: { deliveryRate: { min: 92 }, nodeFailuresTolerated: { min: 1 } },
            1: { deliveryRate: { min: 90 }, nodeFailuresTolerated: { min: 1 } }
        },

        hints: [
            'Mesh = nodes relay for each other',
            'Multiple routes increase reliability',
            'Zigbee uses mesh',
            'More hops = more latency'
        ],

        unlocks: 'iot-6-data-aggregation'
    },

    // ========== INTERMEDIATE LEVELS (6-10) ==========
    {
        id: 'iot-6-data-aggregation',
        title: 'Edge Data Aggregation',
        difficulty: 'intermediate',
        estimatedTime: '18 min',
        module: 'iot-network',

        objective: {
            description: 'Aggregate data at edge before cloud upload',
            challenge: 'Reduce bandwidth usage!',
            requirements: [
                'Add edge aggregator node',
                'Compute averages locally',
                'Bandwidth reduction > 70%',
                'Data quality maintained'
            ]
        },

        constraints: {
            minComponents: 8,
            requiredComponents: ['edge-aggregator'],
            requiredMetrics: {
                bandwidthReduction: { min: 70 },
                dataAccuracy: { min: 95 }
            }
        },

        starRating: {
            3: { bandwidthReduction: { min: 90 }, dataAccuracy: { min: 99 } },
            2: { bandwidthReduction: { min: 80 }, dataAccuracy: { min: 97 } },
            1: { bandwidthReduction: { min: 70 }, dataAccuracy: { min: 95 } }
        },

        hints: [
            'Edge computing = process at source',
            'Send summaries, not raw data',
            'Average, min, max, count',
            'Reduces cloud costs'
        ],

        unlocks: 'iot-7-qos'
    },

    {
        id: 'iot-7-qos',
        title: 'MQTT Quality of Service',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        module: 'iot-network',

        objective: {
            description: 'Implement MQTT QoS levels correctly',
            challenge: 'Balance reliability and overhead!',
            requirements: [
                'Critical alerts: QoS 2 (exactly once)',
                'Regular data: QoS 1 (at least once)',
                'Status updates: QoS 0 (at most once)',
                'Zero critical message loss'
            ]
        },

        constraints: {
            requiredMetrics: {
                qos2Delivery: { min: 100 },
                qos1Delivery: { min: 98 },
                networkOverhead: { max: 30 }
            }
        },

        starRating: {
            3: { networkOverhead: { max: 20 } },
            2: { networkOverhead: { max: 25 } },
            1: { networkOverhead: { max: 30 } }
        },

        hints: [
            'QoS 0: Fire and forget',
            'QoS 1: At least once (ACK)',
            'QoS 2: Exactly once (handshake)',
            'Higher QoS = more overhead'
        ],

        unlocks: 'iot-8-lorawan'
    },

    {
        id: 'iot-8-lorawan',
        title: 'LoRaWAN Long Range',
        difficulty: 'intermediate',
        estimatedTime: '22 min',
        module: 'iot-network',

        objective: {
            description: 'Deploy LoRaWAN for long-range communication',
            challenge: 'Cover 5km radius!',
            requirements: [
                'Add LoRa gateway',
                'LoRa sensors (low data rate)',
                'Communication range > 5km',
                'Battery life > 6 months'
            ]
        },

        constraints: {
            requiredComponents: ['lora-gateway', 'lora-sensor'],
            requiredMetrics: {
                communicationRange: { min: 5000 },
                batteryLifeDays: { min: 180 }
            }
        },

        starRating: {
            3: { communicationRange: { min: 10000 }, batteryLifeDays: { min: 365 } },
            2: { communicationRange: { min: 7000 }, batteryLifeDays: { min: 270 } },
            1: { communicationRange: { min: 5000 }, batteryLifeDays: { min: 180 } }
        },

        hints: [
            'LoRa = Long Range, low power',
            'Sub-GHz frequencies',
            'Spread spectrum modulation',
            'Good for rural deployments'
        ],

        unlocks: 'iot-9-nbiot'
    },

    {
        id: 'iot-9-nbiot',
        title: 'NB-IoT Cellular',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        module: 'iot-network',

        objective: {
            description: 'Use NB-IoT (Narrowband IoT) cellular network',
            challenge: 'Deep indoor penetration!',
            requirements: [
                'Add NB-IoT module',
                'Connect to cellular network',
                'Indoor coverage > 90%',
                'Power consumption < 5mW idle'
            ]
        },

        constraints: {
            requiredComponents: ['nbiot-module'],
            requiredMetrics: {
                indoorCoverage: { min: 90 },
                idlePower: { max: 5 }
            }
        },

        starRating: {
            3: { indoorCoverage: { min: 98 }, idlePower: { max: 3 } },
            2: { indoorCoverage: { min: 95 }, idlePower: { max: 4 } },
            1: { indoorCoverage: { min: 90 }, idlePower: { max: 5 } }
        },

        hints: [
            'NB-IoT uses existing cellular infra',
            'Great penetration through walls',
            'Licensed spectrum',
            'PSM mode for power saving'
        ],

        unlocks: 'iot-10-security'
    },

    {
        id: 'iot-10-security',
        title: 'IoT Security Basics',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        module: 'iot-network',

        objective: {
            description: 'Secure IoT network with encryption and auth',
            challenge: 'Prevent unauthorized access!',
            requirements: [
                'Enable TLS/SSL encryption',
                'Add device authentication',
                'Detect intrusion attempts',
                'Zero successful attacks'
            ]
        },

        constraints: {
            requiredComponents: ['security-module'],
            requiredMetrics: {
                encryptedTraffic: { min: 100 },
                successfulAttacks: { max: 0 },
                authFailures: { min: 1 }
            }
        },

        starRating: {
            3: { encryptionStrength: { min: 256 } },
            2: { encryptionStrength: { min: 128 } },
            1: { successfulAttacks: { max: 0 } }
        },

        hints: [
            'MQTT over TLS = MQTTS',
            'Certificate-based auth',
            'Anomaly detection',
            'Update certificates regularly'
        ],

        unlocks: 'iot-11-edge-ai'
    },

    // ========== ADVANCED LEVELS (11-15) ==========
    {
        id: 'iot-11-edge-ai',
        title: 'Edge AI Inference',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        module: 'iot-network',

        objective: {
            description: 'Run ML model inference at the edge',
            challenge: 'Classify data locally!',
            requirements: [
                'Add edge AI processor',
                'Deploy classification model',
                'Local inference accuracy > 90%',
                'Latency < 100ms'
            ]
        },

        constraints: {
            requiredComponents: ['edge-ai-processor'],
            requiredMetrics: {
                inferenceAccuracy: { min: 90 },
                inferenceLatency: { max: 100 }
            }
        },

        starRating: {
            3: { inferenceAccuracy: { min: 95 }, inferenceLatency: { max: 50 } },
            2: { inferenceAccuracy: { min: 92 }, inferenceLatency: { max: 75 } },
            1: { inferenceAccuracy: { min: 90 }, inferenceLatency: { max: 100 } }
        },

        hints: [
            'TinyML for edge devices',
            'Quantized models',
            'TensorFlow Lite',
            'Classify anomalies locally'
        ],

        unlocks: 'iot-12-digital-twin'
    },

    {
        id: 'iot-12-digital-twin',
        title: 'Digital Twin',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        module: 'iot-network',

        objective: {
            description: 'Create digital twin of physical IoT device',
            challenge: 'Virtual mirror of reality!',
            requirements: [
                'Add digital twin service',
                'Real-time state synchronization',
                'Predictive maintenance alerts',
                'Sync latency < 5 seconds'
            ]
        },

        constraints: {
            requiredComponents: ['digital-twin-service'],
            requiredMetrics: {
                syncLatency: { max: 5 },
                stateAccuracy: { min: 95 },
                predictiveAlerts: { min: 3 }
            }
        },

        starRating: {
            3: { syncLatency: { max: 2 }, stateAccuracy: { min: 99 } },
            2: { syncLatency: { max: 3 }, stateAccuracy: { min: 97 } },
            1: { syncLatency: { max: 5 }, stateAccuracy: { min: 95 } }
        },

        hints: [
            'Digital twin = virtual replica',
            'Cloud-based simulation',
            'Predict failures before they happen',
            'Azure Digital Twins, AWS IoT TwinMaker'
        ],

        unlocks: 'iot-13-swarm'
    },

    {
        id: 'iot-13-swarm',
        title: 'Swarm Intelligence',
        difficulty: 'advanced',
        estimatedTime: '40 min',
        module: 'iot-network',

        objective: {
            description: 'Coordinate swarm of IoT devices',
            challenge: 'Emergent collective behavior!',
            requirements: [
                '20+ autonomous devices',
                'Swarm coordination algorithm',
                'Task completion via collaboration',
                'No central controller'
            ]
        },

        constraints: {
            minComponents: 20,
            topology: 'decentralized',
            requiredMetrics: {
                taskCompletion: { min: 95 },
                coordinationOverhead: { max: 15 }
            }
        },

        starRating: {
            3: { taskCompletion: { min: 99 }, coordinationOverhead: { max: 10 } },
            2: { taskCompletion: { min: 97 }, coordinationOverhead: { max: 12 } },
            1: { taskCompletion: { min: 95 }, coordinationOverhead: { max: 15 } }
        },

        hints: [
            'Swarm = collective intelligence',
            'Boid algorithm for flocking',
            'Ant colony optimization',
            'Drones often use swarm'
        ],

        unlocks: 'iot-14-5g'
    },

    {
        id: 'iot-14-5g',
        title: '5G IoT Network Slicing',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        module: 'iot-network',

        objective: {
            description: '5G network slicing for different IoT use cases',
            challenge: 'Tailor network for each app!',
            requirements: [
                'Create 3 network slices',
                'Ultra-reliable slice (99.999% uptime)',
                'Low-latency slice (<10ms)',
                'Massive IoT slice (10000+ devices)'
            ]
        },

        constraints: {
            requiredComponents: ['5g-network-slicer'],
            sliceCount: { min: 3 },
            requiredMetrics: {
                urlllcUptime: { min: 99.999 },
                urlllcLatency: { max: 10 },
                massiveIoTCapacity: { min: 10000 }
            }
        },

        starRating: {
            3: { urlllcLatency: { max: 5 }, massiveIoTCapacity: { min: 20000 } },
            2: { urlllcLatency: { max: 7 }, massiveIoTCapacity: { min: 15000 } },
            1: { urlllcLatency: { max: 10 }, massiveIoTCapacity: { min: 10000 } }
        },

        hints: [
            'Network slicing = virtual networks',
            'URLLC = ultra-reliable low-latency',
            'eMBB = enhanced mobile broadband',
            'mMTC = massive machine-type comms'
        ],

        unlocks: 'iot-15-energy-harvesting'
    },

    {
        id: 'iot-15-energy-harvesting',
        title: 'Energy Harvesting',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        module: 'iot-network',

        objective: {
            description: 'Power sensors with harvested energy',
            challenge: 'Battery-free operation!',
            requirements: [
                'Add energy harvesting modules',
                'Solar, RF, or kinetic harvesting',
                'Self-sustaining operation > 30 days',
                'Zero battery replacements'
            ]
        },

        constraints: {
            requiredComponents: ['energy-harvester'],
            harvestingTypes: ['solar', 'rf', 'kinetic'],
            requiredMetrics: {
                selfSustainDays: { min: 30 },
                batteryReplacements: { max: 0 }
            }
        },

        starRating: {
            3: { selfSustainDays: { min: 365 } },
            2: { selfSustainDays: { min: 180 } },
            1: { selfSustainDays: { min: 30 } }
        },

        hints: [
            'Solar panels for outdoor',
            'RF harvesting from wireless signals',
            'Kinetic from vibration',
            'Supercapacitors for storage'
        ],

        unlocks: 'iot-16-fog-computing'
    },

    // ========== EXPERT LEVELS (16-20) ==========
    {
        id: 'iot-16-fog-computing',
        title: 'Fog Computing Architecture',
        difficulty: 'expert',
        estimatedTime: '40 min',
        module: 'iot-network',

        objective: {
            description: 'Build multi-tier fog computing system',
            challenge: 'Edge, fog, and cloud layers!',
            requirements: [
                'Edge nodes (local processing)',
                'Fog nodes (regional aggregation)',
                'Cloud (central analytics)',
                'Latency-aware task placement'
            ]
        },

        constraints: {
            minComponents: 15,
            requiredComponents: ['edge-node', 'fog-node', 'cloud-backend'],
            requiredMetrics: {
                avgLatency: { max: 50 },
                cloudBandwidth: { reduction: 80 }
            }
        },

        starRating: {
            3: { avgLatency: { max: 30 }, cloudBandwidth: { reduction: 90 } },
            2: { avgLatency: { max: 40 }, cloudBandwidth: { reduction: 85 } },
            1: { avgLatency: { max: 50 }, cloudBandwidth: { reduction: 80 } }
        },

        hints: [
            'Fog = between edge and cloud',
            'Cisco fog computing',
            'Process latency-sensitive at edge',
            'Analytics and ML in cloud'
        ],

        unlocks: 'iot-17-blockchain'
    },

    {
        id: 'iot-17-blockchain',
        title: 'Blockchain for IoT',
        difficulty: 'expert',
        estimatedTime: '45 min',
        module: 'iot-network',

        objective: {
            description: 'Use blockchain for IoT data integrity',
            challenge: 'Immutable sensor data!',
            requirements: [
                'Add blockchain ledger',
                'Record sensor data on chain',
                'Prevent data tampering',
                'Consensus among nodes'
            ]
        },

        constraints: {
            requiredComponents: ['blockchain-node'],
            minComponents: 10,
            requiredMetrics: {
                dataIntegrity: { min: 100 },
                consensusTime: { max: 10 },
                energyPerTransaction: { max: 100 }
            }
        },

        starRating: {
            3: { consensusTime: { max: 5 }, energyPerTransaction: { max: 50 } },
            2: { consensusTime: { max: 7 }, energyPerTransaction: { max: 75 } },
            1: { consensusTime: { max: 10 }, energyPerTransaction: { max: 100 } }
        },

        hints: [
            'Immutable ledger',
            'IOTA for IoT',
            'Lightweight consensus (PoS)',
            'Avoid Bitcoin-level energy cost'
        ],

        unlocks: 'iot-18-satellite'
    },

    {
        id: 'iot-18-satellite',
        title: 'Satellite IoT',
        difficulty: 'expert',
        estimatedTime: '45 min',
        module: 'iot-network',

        objective: {
            description: 'Connect remote IoT devices via satellite',
            challenge: 'Global coverage!',
            requirements: [
                'Add satellite gateway',
                'LEO satellite constellation',
                'Global coverage > 95%',
                'Latency < 500ms'
            ]
        },

        constraints: {
            requiredComponents: ['satellite-gateway'],
            requiredMetrics: {
                globalCoverage: { min: 95 },
                satLatency: { max: 500 },
                linkAvailability: { min: 99 }
            }
        },

        starRating: {
            3: { globalCoverage: { min: 99 }, satLatency: { max: 200 } },
            2: { globalCoverage: { min: 97 }, satLatency: { max: 350 } },
            1: { globalCoverage: { min: 95 }, satLatency: { max: 500 } }
        },

        hints: [
            'LEO = low earth orbit',
            'Starlink, Iridium',
            'For remote agriculture, maritime',
            'Lower orbit = lower latency'
        ],

        unlocks: 'iot-19-autonomous'
    },

    {
        id: 'iot-19-autonomous',
        title: 'Autonomous Vehicle Network',
        difficulty: 'expert',
        estimatedTime: '50 min',
        module: 'iot-network',

        objective: {
            description: 'V2X (Vehicle-to-Everything) network',
            challenge: 'Connected autonomous vehicles!',
            requirements: [
                'V2V (vehicle-to-vehicle) communication',
                'V2I (vehicle-to-infrastructure)',
                'Ultra-low latency < 5ms',
                'Safety message delivery > 99.99%'
            ]
        },

        constraints: {
            minComponents: 20,
            requiredComponents: ['v2v-module', 'rsu-roadside-unit'],
            requiredMetrics: {
                v2xLatency: { max: 5 },
                safetyMessageDelivery: { min: 99.99 }
            }
        },

        starRating: {
            3: { v2xLatency: { max: 2 }, safetyMessageDelivery: { min: 99.999 } },
            2: { v2xLatency: { max: 3 }, safetyMessageDelivery: { min: 99.995 } },
            1: { v2xLatency: { max: 5 }, safetyMessageDelivery: { min: 99.99 } }
        },

        hints: [
            'DSRC or C-V2X protocols',
            'Cooperative awareness messages',
            'Safety critical',
            'Edge computing for real-time decisions'
        ],

        unlocks: 'iot-20-ultimate'
    },

    {
        id: 'iot-20-ultimate',
        title: 'The Ultimate IoT System',
        difficulty: 'expert',
        estimatedTime: '60 min',
        module: 'iot-network',

        objective: {
            description: 'Build comprehensive IoT ecosystem',
            challenge: 'MASTER ALL IoT TECHNOLOGIES!',
            requirements: [
                'Multi-protocol network (MQTT, LoRa, NB-IoT)',
                'Edge AI processing',
                'Fog computing architecture',
                'Security and encryption',
                'Energy harvesting',
                'Digital twin integration',
                'Blockchain data integrity'
            ]
        },

        constraints: {
            minComponents: 30,
            requiredComponents: [
                'mqtt-broker', 'lora-gateway', 'nbiot-module',
                'edge-ai-processor', 'fog-node',
                'security-module', 'energy-harvester',
                'digital-twin-service', 'blockchain-node'
            ],
            requiredMetrics: {
                networkUptime: { min: 99.9 },
                avgLatency: { max: 50 },
                batteryLifeDays: { min: 180 },
                dataIntegrity: { min: 100 },
                securityLevel: { min: 95 },
                energyEfficiency: { min: 90 }
            }
        },

        starRating: {
            3: {
                networkUptime: { min: 99.99 },
                avgLatency: { max: 30 },
                batteryLifeDays: { min: 365 },
                dataIntegrity: { min: 100 },
                securityLevel: { min: 99 },
                energyEfficiency: { min: 95 },
                hint: '⭐⭐⭐ PERFECT! IoT mastermind!'
            },
            2: {
                networkUptime: { min: 99.95 },
                avgLatency: { max: 40 },
                batteryLifeDays: { min: 270 },
                securityLevel: { min: 97 },
                energyEfficiency: { min: 92 },
                hint: '⭐⭐ Excellent! Enterprise-ready!'
            },
            1: {
                networkUptime: { min: 99.9 },
                avgLatency: { max: 50 },
                batteryLifeDays: { min: 180 },
                securityLevel: { min: 95 },
                energyEfficiency: { min: 90 },
                hint: '⭐ Great! Production-ready IoT!'
            }
        },

        hints: [
            'Integrate all IoT technologies',
            'Real-world IoT is this complex',
            'Balance power, latency, and security',
            'You are now an IoT architect!'
        ],

        unlocks: null // Final level
    }
];

export default IOT_NETWORK_LEVELS;
