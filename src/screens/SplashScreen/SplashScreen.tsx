import React, { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/game';
import { usePlayerStore } from '../../store/playerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/** Splash video encoded at 1080x1920 (9:16). */
const SPLASH_VIDEO = require('../../../assets/splash-screen-video.mp4');
const FALLBACK_MS = 12000;
const TARGET_RATIO = 9 / 16;

export function SplashScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const hydratePlayer = usePlayerStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const navigated = useRef(false);

  const goMenu = () => {
    if (navigated.current) return;
    navigated.current = true;
    navigation.replace('MainMenu');
  };

  const player = useVideoPlayer(SPLASH_VIDEO, (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });

  useEventListener(player, 'playToEnd', goMenu);

  useEffect(() => {
    void Promise.all([hydratePlayer(), hydrateSettings()]);
    const timer = setTimeout(goMenu, FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [hydratePlayer, hydrateSettings]);

  // Fit 9:16 frame inside any phone size without stretching.
  const frameWidth = Math.min(width, height * TARGET_RATIO);
  const frameHeight = frameWidth / TARGET_RATIO;

  return (
    <View style={styles.container}>
      <View style={[styles.frame, { width: frameWidth, height: Math.min(frameHeight, height) }]}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
          nativeControls={false}
          fullscreenOptions={{ enable: false }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.navy,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
