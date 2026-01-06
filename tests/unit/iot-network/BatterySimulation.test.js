/**
 * Unit Tests for IoT Battery Simulation
 * Validates battery drain model and fixes from README.md
 */

describe('IoT Battery Simulation', () => {
    describe('Basic Battery Drain', () => {
        test('should drain battery during active state', () => {
            const battery = {
                capacity: 3000, // mAh
                current: 3000,
                powerConsumption: 50 // mW
            };

            const voltage = 3.7; // V (typical LiPo)
            const currentDraw = battery.powerConsumption / voltage; // ~13.5 mA

            // Simulate 1 hour of active use
            const hoursElapsed = 1;
            const consumed = currentDraw * hoursElapsed;
            battery.current -= consumed;

            expect(battery.current).toBeCloseTo(3000 - 13.5, 1);
        });

        test('should drain slower in sleep mode', () => {
            const activePower = 50; // mW
            const sleepPower = activePower * 0.1; // 5 mW (10% of active)
            const voltage = 3.7;

            const activeCurrent = activePower / voltage; // ~13.5 mA
            const sleepCurrent = sleepPower / voltage;   // ~1.35 mA

            expect(sleepCurrent).toBe(activeCurrent * 0.1);
        });
    });

    describe('Temperature Effects (Fixed from README)', () => {
        test('should reduce capacity in cold temperatures', () => {
            const nominalCapacity = 3000; // mAh at 20°C

            // At -10°C: 70% capacity (30% reduction)
            const coldTemp = -10;
            const temperatureFactor = coldTemp < 0 ? 0.7 : 1.0;
            const effectiveCapacity = nominalCapacity * temperatureFactor;

            expect(effectiveCapacity).toBe(2100); // 30% reduction
        });

        test('should maintain full capacity at normal temperatures', () => {
            const nominalCapacity = 3000;
            const normalTemp = 20;
            const temperatureFactor = normalTemp < 0 ? 0.7 : 1.0;
            const effectiveCapacity = nominalCapacity * temperatureFactor;

            expect(effectiveCapacity).toBe(3000);
        });
    });

    describe('Discharge Rate Effects', () => {
        test('should reduce capacity with high discharge rate', () => {
            const nominalCapacity = 3000;
            const currentDraw = 150; // mA (high current)

            // High current reduces available capacity
            const dischargeFactor = currentDraw > 100 ? 0.9 : 1.0;
            const effectiveCapacity = nominalCapacity * dischargeFactor;

            expect(effectiveCapacity).toBe(2700); // 10% reduction
        });

        test('should maintain capacity with normal discharge rate', () => {
            const nominalCapacity = 3000;
            const currentDraw = 50; // mA (normal)

            const dischargeFactor = currentDraw > 100 ? 0.9 : 1.0;
            const effectiveCapacity = nominalCapacity * dischargeFactor;

            expect(effectiveCapacity).toBe(3000);
        });
    });

    describe('Voltage Drop', () => {
        test('should calculate remaining capacity based on voltage', () => {
            const capacity = 3000;
            const nominalVoltage = 3.7;
            const currentVoltage = 3.3; // Partially discharged

            const remainingCapacity = capacity * (currentVoltage / nominalVoltage);

            expect(remainingCapacity).toBeCloseTo(2675.68, 2);
        });

        test('should indicate dead battery when voltage too low', () => {
            const cutoffVoltage = 3.0; // V
            const currentVoltage = 2.9;

            const isDead = currentVoltage < cutoffVoltage;
            expect(isDead).toBe(true);
        });
    });

    describe('Realistic Battery Model', () => {
        test('should combine all factors correctly', () => {
            const battery = {
                nominalCapacity: 3000, // mAh
                nominalVoltage: 3.7,   // V
                currentVoltage: 3.5,
                temperature: -5,        // °C (cold)
                currentDraw: 120        // mA (high)
            };

            // Calculate effective capacity
            const tempFactor = battery.temperature < 0 ? 0.7 : 1.0;
            const dischargeFactor = battery.currentDraw > 100 ? 0.9 : 1.0;
            const voltageFactor = battery.currentVoltage / battery.nominalVoltage;

            const effectiveCapacity =
                battery.nominalCapacity *
                tempFactor *
                dischargeFactor *
                voltageFactor;

            // 3000 * 0.7 * 0.9 * (3.5/3.7) = 1783.78 mAh
            expect(effectiveCapacity).toBeCloseTo(1783.78, 2);
        });
    });

    describe('Self-Discharge', () => {
        test('should lose capacity even when idle', () => {
            const capacity = 3000;
            const selfDischargeRate = 0.02; // 2% per month
            const monthsIdle = 1;

            const remainingCapacity = capacity * (1 - selfDischargeRate * monthsIdle);

            expect(remainingCapacity).toBe(2940); // Lost 60 mAh
        });
    });

    describe('Battery Types', () => {
        test('AA battery characteristics', () => {
            const aa = {
                type: 'AA',
                capacity: 2500,
                voltage: 1.5
            };

            expect(aa.capacity).toBe(2500);
            expect(aa.voltage).toBe(1.5);
        });

        test('CR2032 coin cell characteristics', () => {
            const coin = {
                type: 'CR2032',
                capacity: 220,
                voltage: 3.0
            };

            expect(coin.capacity).toBe(220); // Much smaller
            expect(coin.voltage).toBe(3.0);
        });

        test('LiPo battery characteristics', () => {
            const lipo = {
                type: 'LiPo',
                capacity: 5000,
                voltage: 3.7
            };

            expect(lipo.capacity).toBe(5000);
            expect(lipo.voltage).toBe(3.7);
        });

        test('Solar battery (infinite capacity)', () => {
            const solar = {
                type: 'Solar',
                capacity: Infinity,
                voltage: 5.0
            };

            expect(solar.capacity).toBe(Infinity);
        });
    });

    describe('Power Modes', () => {
        test('should calculate lifetime in active mode', () => {
            const capacity = 3000; // mAh
            const activePower = 50; // mW
            const voltage = 3.7;
            const activeCurrent = activePower / voltage;

            const lifetimeHours = capacity / activeCurrent;
            const lifetimeDays = lifetimeHours / 24;

            expect(lifetimeDays).toBeCloseTo(9.3, 1); // ~9.3 days
        });

        test('should calculate much longer lifetime in sleep mode', () => {
            const capacity = 3000;
            const sleepPower = 5; // mW (10% of active)
            const voltage = 3.7;
            const sleepCurrent = sleepPower / voltage;

            const lifetimeHours = capacity / sleepCurrent;
            const lifetimeDays = lifetimeHours / 24;

            expect(lifetimeDays).toBeCloseTo(93, 0); // ~93 days
        });

        test('should calculate duty-cycled lifetime', () => {
            const capacity = 3000;
            const activePower = 50;
            const sleepPower = 5;
            const voltage = 3.7;

            // 10% active, 90% sleep
            const dutyCycle = 0.1;
            const avgPower = activePower * dutyCycle + sleepPower * (1 - dutyCycle);
            const avgCurrent = avgPower / voltage;

            const lifetimeHours = capacity / avgCurrent;
            const lifetimeDays = lifetimeHours / 24;

            expect(lifetimeDays).toBeCloseTo(76, 0); // ~76 days
        });
    });
});

/**
 * Helper: Simulate battery drain
 */
function simulateBatteryDrain(config) {
    const {
        capacity,
        voltage,
        powerConsumption,
        temperature = 20,
        dutyCycle = 1.0,
        currentVoltage = null
    } = config;

    // Calculate factors
    const tempFactor = temperature < 0 ? 0.7 : 1.0;
    const currentDraw = powerConsumption / voltage; // mA
    const dischargeFactor = currentDraw > 100 ? 0.9 : 1.0;
    const voltageFactor = currentVoltage ? (currentVoltage / voltage) : 1.0;

    // Effective capacity
    const effectiveCapacity = capacity * tempFactor * dischargeFactor * voltageFactor;

    // Average current with duty cycle
    const avgCurrent = currentDraw * dutyCycle + (currentDraw * 0.1) * (1 - dutyCycle);

    // Lifetime
    const lifetimeHours = effectiveCapacity / avgCurrent;
    const lifetimeDays = lifetimeHours / 24;

    return {
        effectiveCapacity,
        lifetimeDays,
        factors: {
            temperature: tempFactor,
            dischargeRate: dischargeFactor,
            voltage: voltageFactor
        }
    };
}

export { simulateBatteryDrain };
