'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import type { PropsWithChildren } from 'react';

/**
 * RoomHub design-system theme for Ant Design.
 * Centralises colors, radius, typography and component styling so every
 * dashboard table / form / modal / button stays visually consistent.
 */
const AntdThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#059669',
          colorInfo: '#10B981',
          colorSuccess: '#22C55E',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          colorLink: '#059669',
          colorLinkHover: '#10B981',
          colorTextHeading: '#1E293B',
          colorText: '#334155',
          colorTextSecondary: '#64748B',
          colorBgLayout: '#F8FAFC',
          colorBorder: '#E2E8F0',
          borderRadius: 10,
          borderRadiusLG: 14,
          fontFamily:
            'var(--font-inter), Inter, Roboto, "Segoe UI", system-ui, sans-serif',
          fontSize: 14,
          controlHeight: 40,
          boxShadow:
            '0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)',
          boxShadowSecondary:
            '0 2px 8px rgba(16,24,40,0.06), 0 12px 28px rgba(16,24,40,0.06)',
        },
        components: {
          Button: {
            controlHeight: 42,
            borderRadius: 12,
            fontWeight: 600,
            primaryShadow: '0 2px 8px rgba(5,150,105,0.18)',
          },
          Input: { controlHeight: 44, borderRadius: 10 },
          InputNumber: { controlHeight: 44, borderRadius: 10 },
          Select: { controlHeight: 44, borderRadius: 10 },
          DatePicker: { controlHeight: 44, borderRadius: 10 },
          Table: {
            headerBg: '#F1F5F9',
            headerColor: '#1E293B',
            headerSplitColor: 'transparent',
            rowHoverBg: '#ECFDF5',
            borderColor: '#E2E8F0',
            cellPaddingBlock: 14,
          },
          Modal: { borderRadiusLG: 18 },
          Card: { borderRadiusLG: 16 },
          Menu: {
            itemSelectedBg: '#ECFDF5',
            itemSelectedColor: '#059669',
            itemBorderRadius: 10,
            itemHeight: 44,
            iconSize: 18,
          },
          Pagination: { borderRadius: 10 },
          Tag: { borderRadiusSM: 8 },
          Tabs: { titleFontSize: 15 },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdThemeProvider;
