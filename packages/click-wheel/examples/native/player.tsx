import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { ClickWheel, useClickWheel } from "../../src/native";

const DURATION = 227;

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/** A tick texture: 24 marks that turn with the finger. */
function Ticks() {
  return (
    <>
      {Array.from({ length: 24 }, (_, i) => (
        <View key={i} style={[styles.tick, { transform: [{ rotate: `${i * 15}deg` }] }]} />
      ))}
    </>
  );
}

/** An arc that fills with the value. Reads the wheel's shared values, no React render. */
function Needle() {
  const { rotation } = useClickWheel();
  const turn = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  return <Animated.View style={[styles.needleArm, turn]} pointerEvents="none" />;
}

export function Player() {
  const [seconds, setSeconds] = React.useState(72);
  const [playing, setPlaying] = React.useState(false);

  return (
    <View style={styles.screen}>
      <ClickWheel.Root
        value={seconds}
        onValueChange={setSeconds}
        max={DURATION}
        unitsPerTurn={60} // one lap = one minute
        detent={5} // a tick every five seconds
        inertia
        style={styles.wheel}
      >
        <ClickWheel.Ring
          accessibilityLabel="Playback position"
          style={({ turning }) => [styles.ring, turning && styles.ringTurning]}
        >
          <ClickWheel.Rotor style={StyleSheet.absoluteFill}>
            <Ticks />
          </ClickWheel.Rotor>
          <Needle />
        </ClickWheel.Ring>
        <ClickWheel.Center
          accessibilityLabel={playing ? "Pause" : "Play"}
          onPress={() => setPlaying((p) => !p)}
          style={({ pressed }) => [styles.center, pressed && styles.centerPressed]}
        >
          <Text style={styles.glyph}>{playing ? "❚❚" : "▶"}</Text>
        </ClickWheel.Center>
      </ClickWheel.Root>
      <Text style={styles.readout}>
        {fmt(seconds)} / {fmt(DURATION)}
      </Text>
    </View>
  );
}

const SIZE = 240;

const styles = StyleSheet.create({
  screen: { alignItems: "center", gap: 24, padding: 24 },
  wheel: { width: SIZE, height: SIZE },
  ring: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: SIZE / 2,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  ringTurning: { backgroundColor: "#e4e4e7" },
  tick: {
    position: "absolute",
    left: SIZE / 2 - 1,
    top: 10,
    width: 2,
    height: 14,
    borderRadius: 1,
    backgroundColor: "#a1a1aa",
    transformOrigin: `1px ${SIZE / 2 - 10}px`,
  },
  needleArm: {
    position: "absolute",
    left: SIZE / 2 - 1.5,
    top: 28,
    width: 3,
    height: 34,
    borderRadius: 2,
    backgroundColor: "#18181b",
    transformOrigin: `1.5px ${SIZE / 2 - 28}px`,
  },
  center: {
    position: "absolute",
    left: SIZE * 0.31,
    top: SIZE * 0.31,
    width: SIZE * 0.38,
    height: SIZE * 0.38,
    borderRadius: SIZE * 0.19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  centerPressed: { transform: [{ scale: 0.95 }] },
  glyph: { fontSize: 18, color: "#18181b" },
  readout: { fontVariant: ["tabular-nums"], fontSize: 16, color: "#52525b" },
});
