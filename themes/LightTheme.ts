import { DefaultTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', // Set light background color
    card: '#f9f9f9',       // Set card color
    text: '#000000',       // Set text color
    border: '#e0e0e0',     // Set border color
    primary: '#007BFF',    // Set primary color
  },
};
