import { useState, useEffect, useCallback } from "react";

interface CompassState {
  heading: number | null;
  accuracy: number | null;
  isSupported: boolean;
  isPermissionGranted: boolean;
  error: string | null;
}

export function useCompass() {
  const [state, setState] = useState<CompassState>({
    heading: null,
    accuracy: null,
    isSupported: false,
    isPermissionGranted: false,
    error: null,
  });

  const requestPermission = useCallback(async () => {
    // iOS 13+ requires permission request
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (permission === "granted") {
          setState((s) => ({ ...s, isPermissionGranted: true }));
          return true;
        } else {
          setState((s) => ({
            ...s,
            error: "Permissão negada para acessar a bússola.",
          }));
          return false;
        }
      } catch {
        setState((s) => ({
          ...s,
          error: "Erro ao solicitar permissão da bússola.",
        }));
        return false;
      }
    }
    // Non-iOS or older — permission not needed
    setState((s) => ({ ...s, isPermissionGranted: true }));
    return true;
  }, []);

  useEffect(() => {
    const supported = !!window.DeviceOrientationEvent;
    setState((s) => ({ ...s, isSupported: supported }));

    if (!supported) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Safari uses webkitCompassHeading (0-360, 0=North)
      const webkit = (event as any).webkitCompassHeading as number | undefined;
      const accuracy = (event as any).webkitCompassAccuracy as
        | number
        | undefined;

      if (webkit !== undefined && webkit !== null) {
        setState((s) => ({
          ...s,
          heading: webkit,
          accuracy: accuracy ?? null,
          isPermissionGranted: true,
        }));
      } else if (event.alpha !== null) {
        // Chrome/Firefox: alpha is rotation around z-axis
        // heading = 360 - alpha (approximate, less accurate without absolute orientation)
        const heading = event.absolute
          ? (360 - event.alpha) % 360
          : (360 - event.alpha) % 360;
        setState((s) => ({
          ...s,
          heading: Math.round(heading),
          accuracy: null,
          isPermissionGranted: true,
        }));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    };
  }, []);

  return { ...state, requestPermission };
}
