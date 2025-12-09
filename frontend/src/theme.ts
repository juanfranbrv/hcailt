import type { ThemeConfig } from 'antd';

export const themes: Record<string, ThemeConfig> = {
  light: {
    token: {
      colorBgBase: '#f7f9fb',
      colorText: '#0f172a',
      colorPrimary: '#0052cc',
      colorSuccess: '#0fbf61',
      colorInfo: '#1677ff',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      borderRadius: 10,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
  },
  dark: {
    token: {
      colorBgBase: '#0b0c0f',
      colorText: '#e5e7eb',
      colorPrimary: '#0052cc',
      colorSuccess: '#4ade80',
      colorInfo: '#60a5fa',
      colorWarning: '#fbbf24',
      colorError: '#f87171',
      borderRadius: 10,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    algorithm: [],
  },
  contrast: {
    token: {
      colorBgBase: '#0f172a',
      colorText: '#f8fafc',
      colorPrimary: '#0052cc',
      colorSuccess: '#22c55e',
      colorInfo: '#38bdf8',
      colorWarning: '#fb923c',
      colorError: '#f43f5e',
      borderRadius: 12,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
  },
};
