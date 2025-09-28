// XP rewards for different actions
export const XP_REWARDS = {
    THREAD_CREATED: 10,
    CHAIN_CREATED: 25,
    UPVOTE_GIVEN: 2,
    DOWNVOTE_GIVEN: 1,
    REFERRAL_USED: 50, // XP for user who used referral code
    REFERRAL_EARNED: 100, // XP for user whose referral code was used
    VERIFICATION_COMPLETED: 20
};

// Level thresholds (XP required for each level)
export const LEVEL_THRESHOLDS = [
    0,    // Level 1: 0 XP
    200,  // Level 2: 200 XP
    500,  // Level 3: 500 XP
    1000, // Level 4: 1000 XP
    2000, // Level 5: 2000 XP
    3500, // Level 6: 3500 XP
    5500, // Level 7: 5500 XP
    8000, // Level 8: 8000 XP
    11000, // Level 9: 11000 XP
    15000  // Level 10: 15000 XP
];
