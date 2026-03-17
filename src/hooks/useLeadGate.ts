import { useState, useCallback } from "react";

const STORAGE_KEY_PREFIX = "tng_lead_";
const SKIP_KEY_PREFIX = "tng_skip_";
const MAX_SKIPS = 2;

export const useLeadGate = (cardId: string | null) => {
  const [hasSubmitted, setHasSubmitted] = useState(() => {
    if (!cardId) return false;
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${cardId}`) === "true";
  });

  const [skipsUsed, setSkipsUsed] = useState(() => {
    if (!cardId) return 0;
    return parseInt(localStorage.getItem(`${SKIP_KEY_PREFIX}${cardId}`) || "0", 10);
  });

  const markSubmitted = useCallback(() => {
    if (!cardId) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${cardId}`, "true");
    setHasSubmitted(true);
  }, [cardId]);

  const useSkip = useCallback(() => {
    if (!cardId) return;
    const newCount = skipsUsed + 1;
    localStorage.setItem(`${SKIP_KEY_PREFIX}${cardId}`, String(newCount));
    setSkipsUsed(newCount);
  }, [cardId, skipsUsed]);

  const skipsRemaining = Math.max(0, MAX_SKIPS - skipsUsed);
  const shouldGate = !hasSubmitted;

  return { hasSubmitted, shouldGate, skipsRemaining, markSubmitted, useSkip };
};
