import { Colors } from "@/constants/Colors";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, StyleSheet } from "react-native";

// Define the props and ref types
interface CountdownTimerProps {
  onExpire: () => void;
}

interface CountdownTimerHandle {
  resetTimer: () => void;
}

const CountdownTimer = forwardRef<CountdownTimerHandle, CountdownTimerProps>(
  ({ onExpire }, ref) => {
    const [seconds, setSeconds] = useState<number>(10 * 60);
    const [isRunning, setIsRunning] = useState<boolean>(true);

    useEffect(() => {
      if (seconds <= 0) {
        onExpire?.();
        return;
      }

      let interval: NodeJS.Timeout;
      if (isRunning) {
        interval = setInterval(() => {
          setSeconds((prev) => prev - 1);
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [seconds, onExpire, isRunning]);

    // Format time as MM:SS
    const formatTime = (secs: number) => {
      const minutes = Math.floor(secs / 60);
      const sec = secs % 60;
      return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
    };

    // Expose resetTimer to parent using ref
    useImperativeHandle(ref, () => ({
      resetTimer: () => {
        setSeconds(10 * 60); // Reset to 10 minutes
        setIsRunning(true); // Ensure the timer is running
      },
    }));

    return (
      <View style={styles.container}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    textAlign: "center",
    color: Colors.app.failed,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    fontStyle: "normal",
  },
});

export default CountdownTimer;
