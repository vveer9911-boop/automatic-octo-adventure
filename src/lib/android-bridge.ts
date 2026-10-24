/**
 * Clean-room Android APK Native Bridge (Capacitor + Web Fallback)
 * Connects the UI to Android's UsageStatsManager, Overlay/Accessibility Blocker,
 * DevicePolicyManager (Uninstall Protection), Accelerometer Sensor, BiometricPrompt,
 * Monotonic SystemClock, and Ongoing Foreground Service Notification.
 */

export interface AndroidPermissionStatus {
  usageStatsGranted: boolean;
  overlayShieldGranted: boolean;
  notificationsGranted: boolean;
  deviceAdminGranted: boolean;
}

export interface MonotonicClockSample {
  wallTimeMs: number;
  monotonicMs: number;
}

/**
 * Samples both wall clock and monotonic clock to detect manual system clock tampering.
 */
export function sampleClock(): MonotonicClockSample {
  return {
    wallTimeMs: Date.now(),
    monotonicMs: typeof performance !== "undefined" ? performance.now() : Date.now(),
  };
}

/**
 * Checks whether the user jumped their device system clock forward/backward
 * compared to hardware monotonic time (> 120s drift = tamper detected).
 */
export function detectClockTamper(
  startSample: MonotonicClockSample,
  currentSample: MonotonicClockSample,
  maxDriftSeconds = 120
): { tampered: boolean; driftSeconds: number } {
  const wallDeltaSec = (currentSample.wallTimeMs - startSample.wallTimeMs) / 1000;
  const monoDeltaSec = (currentSample.monotonicMs - startSample.monotonicMs) / 1000;
  const driftSeconds = Math.abs(wallDeltaSec - monoDeltaSec);
  return {
    tampered: driftSeconds > maxDriftSeconds,
    driftSeconds: Math.round(driftSeconds),
  };
}

/**
 * Subscribes to device accelerometer motion events (Android Sensor.TYPE_ACCELEROMETER
 * or browser DeviceMotionEvent) and invokes onExcessiveMotion when acceleration exceeds threshold.
 */
export function subscribeAccelerometerMotion(
  sensitivity: "low" | "medium" | "high",
  onExcessiveMotion: (peakMagnitudeG: number) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const thresholdG =
    sensitivity === "high" ? 1.35 : sensitivity === "medium" ? 1.65 : 2.1;

  const handler = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;
    const magnitudeG = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2) / 9.81;
    if (magnitudeG > thresholdG) {
      onExcessiveMotion(Number(magnitudeG.toFixed(2)));
    }
  };

  window.addEventListener("devicemotion", handler);
  return () => window.removeEventListener("devicemotion", handler);
}

/**
 * Triggers Android BiometricPrompt (Fingerprint / Face Unlock) or WebAuthn / simulated confirmation.
 */
export async function verifyAndroidBiometric(reason: string): Promise<boolean> {
  if (typeof window === "undefined") return true;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: Record<string, Record<string, (arg: unknown) => Promise<{ verified?: boolean }>>> } }).Capacitor;
  if (cap?.isNativePlatform?.() && cap.Plugins?.ScreenTimeWallet) {
    try {
      const res = await cap.Plugins.ScreenTimeWallet.authenticateBiometric({ reason });
      return Boolean(res?.verified);
    } catch {
      return false;
    }
  }
  return true;
}
