export type Theme = 'cartoon' | 'chinese';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
