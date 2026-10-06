import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/game';
import { SplashScreen } from '../screens/SplashScreen/SplashScreen';
import { MainMenuScreen } from '../screens/MainMenuScreen/MainMenuScreen';
import { ModeSelectionScreen } from '../screens/ModeSelectionScreen/ModeSelectionScreen';
import { LevelSelectionScreen } from '../screens/LevelSelectionScreen/LevelSelectionScreen';
import { CharacterSelectionScreen } from '../screens/CharacterSelectionScreen/CharacterSelectionScreen';
import { PlayerSetupScreen } from '../screens/PlayerSetupScreen/PlayerSetupScreen';
import { BattleScreen } from '../screens/BattleScreen/BattleScreen';
import { ResultScreen } from '../screens/ResultScreen/ResultScreen';
import { HowToPlayScreen } from '../screens/HowToPlayScreen/HowToPlayScreen';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import { AchievementScreen } from '../screens/AchievementScreen/AchievementScreen';
import { SettingsScreen } from '../screens/SettingsScreen/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen/AboutScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
        <Stack.Screen name="CharacterSelection" component={CharacterSelectionScreen} />
        <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} />
        <Stack.Screen name="Battle" component={BattleScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Achievement" component={AchievementScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
