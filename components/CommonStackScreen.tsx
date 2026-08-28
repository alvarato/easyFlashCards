import React from 'react';
import { Stack } from 'expo-router'; // O import de '@react-navigation/native-stack'
import { theme } from '@/styles/Theme';

interface CommonStackScreenProps {
  title: string;
}

export const CommonStackScreen: React.FC<CommonStackScreenProps> = ({ title }) => {

  return (
    <Stack.Screen
      options={{
        title: title,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textSecondary, // Cambia a theme.colors.textSecondary si usas un tema custom
      }}
    />
  );
};