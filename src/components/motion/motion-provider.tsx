"use client";

import { MotionConfig } from "framer-motion";
import { useAccessibility } from "@/components/accessibility/accessibility-provider";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { prefs } = useAccessibility();
  return (
    <MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>{children}</MotionConfig>
  );
}
