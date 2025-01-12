import { DefaultTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',       
    card: '#f9f9f9',       
    border: '#e0e0e0',     
    notification: '#ff0000', 
    primary: '#007BFF',    
  },
};
