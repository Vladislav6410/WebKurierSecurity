/**
 * MediaCleaner policy gate
 * Security repo checks:
 * - auth presence
 * - limits
 * - allowed actions
 */

export const MediaCleanerPolicy = {
  name: "MediaCleanerPolicy",

  async assertAllowed(action, ctx) {
    // Minimal placeholder gate.
    // Later: validate JWT/session, apply rate-limits, role rules, etc.
    if (!ctx?.userId) {
      throw new Error("SECURITY_DENIED: userId required");
    }

    const allowed = [
      "mediaCleaner:startSession",
      "mediaCleaner:submitResults",
      "mediaCleaner:listSessions",
      "mediaCleaner:rewardCleanup",
    ];

    if (!allowed.includes(action)) {
      throw new Error(`SECURITY_DENIED: action not allowed (${action})`);
    }

    return true;
  },
};