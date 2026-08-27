// src/theme/globalStyles.ts
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from './Theme';

export const spacingsStyles = StyleSheet.create({
  // --- MARGINS ---
  m_s: { margin: theme.spacing.s },
  m_m: { margin: theme.spacing.m },
  m_l: { margin: theme.spacing.l },
  m_xl: { margin: theme.spacing.xl },
  m_xxl: { margin: theme.spacing.xxl },

  // --- MARGIN BOTTOM ---
  mb_s: { marginBottom: theme.spacing.s },
  mb_m: { marginBottom: theme.spacing.m },
  mb_l: { marginBottom: theme.spacing.l },
  mb_xl: { marginBottom: theme.spacing.xl },
  mb_xxl: { marginBottom: theme.spacing.xxl },

  // --- MARGIN TOP ---
  mt_s: { marginTop: theme.spacing.s },
  mt_m: { marginTop: theme.spacing.m },
  mt_l: { marginTop: theme.spacing.l },
  mt_xl: { marginTop: theme.spacing.xl },
  mt_xxl: { marginTop: theme.spacing.xxl },

  // --- PADDING GENERAL ---
  p_s: { padding: theme.spacing.s },
  p_m: { padding: theme.spacing.m },
  p_l: { padding: theme.spacing.l },
  p_xl: { padding: theme.spacing.xl },
  p_xxl: { padding: theme.spacing.xxl },

  // --- PADDING VERTICAL ---
  pv_s: { paddingVertical: theme.spacing.s },
  pv_m: { paddingVertical: theme.spacing.m },
  pv_l: { paddingVertical: theme.spacing.l },
  pv_xl: { paddingVertical: theme.spacing.xl },
  pv_xxl: { paddingVertical: theme.spacing.xxl },

  // --- PADDING HORIZONTAL ---
  ph_s: { paddingHorizontal: theme.spacing.s },
  ph_m: { paddingHorizontal: theme.spacing.m },
  ph_l: { paddingHorizontal: theme.spacing.l },
  ph_xl: { paddingHorizontal: theme.spacing.xl },
  ph_xxl: { paddingHorizontal: theme.spacing.xxl },

  // --- PADDING BOTTOM ---
  pb_s: { paddingBottom: theme.spacing.s },
  pb_m: { paddingBottom: theme.spacing.m },
  pb_l: { paddingBottom: theme.spacing.l },
  pb_xl: { paddingBottom: theme.spacing.xl },
  pb_xxl: { paddingBottom: theme.spacing.xxl },

  // --- PADDING TOP ---
  pt_s: { paddingTop: theme.spacing.s },
  pt_m: { paddingTop: theme.spacing.m },
  pt_l: { paddingTop: theme.spacing.l },
  pt_xl: { paddingTop: theme.spacing.xl },
  pt_xxl: { paddingTop: theme.spacing.xxl },

});