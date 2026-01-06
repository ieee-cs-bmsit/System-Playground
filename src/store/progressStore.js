import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Progress Store - Tracks user's level completion and achievements
 * Persisted to localStorage
 */
const useProgressStore = create(
    persist(
        (set, get) => ({
            // Progress data structure
            progress: {
                'os-scheduler': {},
                'pc-architecture': {},
                'ram-simulator': {},
                'iot-network': {}
            },

            // Unlocked levels (first level of each module is unlocked by default)
            unlockedLevels: [
                'os-1-intro',            // OS Scheduler Level 1 (FIXED ID)
                'pc-1-intro',            // PC Architecture Level 1
                'ram-1-intro',           // RAM Simulator Level 1
                'iot-1-first-sensor'     // IoT Network Level 1
            ],

            // Achievements
            achievements: [],

            // Global stats
            totalStars: 0,
            totalLevelsCompleted: 0,
            totalPlaytime: 0, // seconds
            achievements: [],

            // Current session
            currentLevel: null,


            // === ACTIONS ===

            /**
             * Complete a level with results
             */
            completeLevel: (levelId, result) => {
                const existingProgress = get().levelProgress?.[levelId] || {};
                const newStars = Math.max(existingProgress.stars || 0, result.stars);
                const isFirstCompletion = !existingProgress.completed;
                const isImprovement = newStars > (existingProgress.stars || 0);

                set(state => ({
                    levelProgress: {
                        ...state.levelProgress,
                        [levelId]: {
                            completed: true,
                            stars: newStars,
                            bestTime: Math.min(existingProgress.bestTime || Infinity, result.time || Infinity),
                            bestMetrics: result.metrics,
                            lastPlayed: Date.now(),
                            attempts: (existingProgress.attempts || 0) + 1,
                            history: [
                                ...(existingProgress.history || []).slice(-4), // Keep last 5 attempts
                                {
                                    timestamp: Date.now(),
                                    stars: result.stars,
                                    time: result.time,
                                    metrics: result.metrics
                                }
                            ]
                        }
                    },
                    totalStars: state.totalStars + (isImprovement ? (newStars - (existingProgress.stars || 0)) : 0),
                    totalLevelsCompleted: isFirstCompletion
                        ? state.totalLevelsCompleted + 1
                        : state.totalLevelsCompleted
                }));

                // Unlock next level if specified
                if (result.unlocks) {
                    get().unlockLevel(result.unlocks);
                    console.log(`🔓 Unlocked next level: ${result.unlocks}`);
                }

                // Check for achievements
                get().checkAchievements(levelId, result);

                console.log(`✅ Level ${levelId} completed with ${newStars} stars`);
            },

            /**
             * Unlock a level
             */
            unlockLevel: (levelId) => {
                set(state => {
                    if (state.unlockedLevels.includes(levelId)) {
                        return state; // Already unlocked
                    }

                    return {
                        unlockedLevels: [...state.unlockedLevels, levelId]
                    };
                });
            },

            /**
             * Check if a level is unlocked
             */
            isLevelUnlocked: (levelId) => {
                return get().unlockedLevels.includes(levelId);
            },

            /**
             * Get stars for a specific level
             */
            getLevelStars: (levelId) => {
                const state = get();
                return state.levelProgress?.[levelId]?.stars || 0;
            },

            /**
             * Get progress for a specific level
             */
            getLevelProgress: (levelId) => {
                const state = get();
                return state.levelProgress?.[levelId] || null;
            },

            /**
             * Set current level
             */
            setCurrentLevel: (levelId) => {
                set({ currentLevel: levelId });
            },

            /**
             * Add playtime (called from simulation tick)
             */
            addPlaytime: (seconds) => {
                set(state => ({
                    totalPlaytime: state.totalPlaytime + seconds
                }));
            },

            /**
             * Reset all progress (for development/testing)
             */
            resetAllProgress: () => {
                set({
                    levelProgress: {},
                    unlockedLevels: ['os-1-intro', 'pc-1-intro', 'ram-1-intro', 'iot-1-first-sensor'],
                    totalStars: 0,
                    totalLevelsCompleted: 0,
                    totalPlaytime: 0,
                    achievements: [],
                    currentLevel: null
                });
            },

            /**
             * Force unlock first levels (use this in console if locked)
             */
            forceUnlockFirstLevels: () => {
                set({
                    unlockedLevels: ['os-1-intro', 'pc-1-intro', 'ram-1-intro', 'iot-1-first-sensor']
                });
            },

            /**
             * Get overall progress percentage
             */
            getOverallProgress: () => {
                const totalLevels = 80; // 20 per module × 4 modules (will update when we add more)
                return {
                    completed: get().totalLevelsCompleted,
                    total: totalLevels,
                    percentage: (get().totalLevelsCompleted / totalLevels) * 100
                };
            },

            /**
             * Get module-specific progress
             */
            getModuleProgress: (modulePrefix) => {
                const moduleLevels = Object.keys(get().levelProgress).filter(id => id.startsWith(modulePrefix));
                const completedLevels = moduleLevels.filter(id => get().levelProgress[id]?.completed);
                const totalStars = moduleLevels.reduce((sum, id) => sum + (get().levelProgress[id]?.stars || 0), 0);

                return {
                    completed: completedLevels.length,
                    totalStars,
                    maxStars: moduleLevels.length * 3,
                    percentage: moduleLevels.length > 0 ? (completedLevels.length / moduleLevels.length) * 100 : 0
                };
            },

            /**
             * Check and award achievements
             */
            checkAchievements: (levelId, result) => {
                const achievements = get().achievements;
                const newAchievements = [];

                // Perfect Score (3 stars on first try)
                if (result.stars === 3 && get().levelProgress[levelId]?.attempts === 0) {
                    if (!achievements.includes('first-try-perfect')) {
                        newAchievements.push({
                            id: 'first-try-perfect',
                            title: '🌟 First Try Perfect',
                            description: 'Got 3 stars on first attempt',
                            timestamp: Date.now()
                        });
                    }
                }

                // Speed Runner (complete in under 30 seconds)
                if (result.time && result.time < 30) {
                    if (!achievements.includes('speed-runner')) {
                        newAchievements.push({
                            id: 'speed-runner',
                            title: '⚡ Speed Runner',
                            description: 'Completed a level in under 30 seconds',
                            timestamp: Date.now()
                        });
                    }
                }

                // Perfectionist (10 levels with 3 stars)
                const threeStarLevels = Object.values(get().levelProgress).filter(p => p.stars === 3).length;
                if (threeStarLevels >= 10 && !achievements.includes('perfectionist')) {
                    newAchievements.push({
                        id: 'perfectionist',
                        title: '💎 Perfectionist',
                        description: 'Earned 3 stars on 10 levels',
                        timestamp: Date.now()
                    });
                }

                // Module Master (complete all levels in a module)
                const modulePrefix = levelId.split('-')[0];
                const moduleProgress = get().getModuleProgress(modulePrefix);
                if (moduleProgress.completed >= 20 && !achievements.includes(`${modulePrefix}-master`)) {
                    newAchievements.push({
                        id: `${modulePrefix}-master`,
                        title: `🏆 ${modulePrefix.toUpperCase()} Master`,
                        description: `Completed all ${modulePrefix} levels`,
                        timestamp: Date.now()
                    });
                }

                // Add new achievements
                if (newAchievements.length > 0) {
                    set(state => ({
                        achievements: [...state.achievements, ...newAchievements.map(a => a.id)]
                    }));
                }

                return newAchievements;
            },

            /**
             * Get leaderboard data (for future multiplayer/social features)
             */
            getLeaderboardData: () => {
                return {
                    totalStars: get().totalStars,
                    levelsCompleted: get().totalLevelsCompleted,
                    playtime: get().totalPlaytime,
                    achievements: get().achievements.length
                };
            }
        }),
        {
            name: 'vsb-progress', // localStorage key
            version: 3, // Incremented to force refresh with correct IDs
            // Migrate old data if needed
            migrate: (persistedState, version) => {
                if (version < 3) {
                    // Force reset unlocked levels with CORRECT IDs
                    return {
                        ...persistedState,
                        unlockedLevels: [
                            'os-1-intro',           // Corrected from os-1-round-robin
                            'pc-1-intro',
                            'ram-1-intro',
                            'iot-1-first-sensor'
                        ]
                    };
                }
                return persistedState;
            }
        }
    )
);

export default useProgressStore;
