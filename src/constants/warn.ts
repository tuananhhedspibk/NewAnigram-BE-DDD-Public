export const WarnCode = {
  SYSTEM_WARN: 'SYSTEM_WARN',
} as const;

export type WarnCode = typeof WarnCode[keyof typeof WarnCode];

export const WARN_MESSAGE: {
  [key: string]: string;
} = {
  [WarnCode.SYSTEM_WARN]: 'System warning',
};

export const getWarnMessage = (warnCode: WarnCode): string => {
  return WARN_MESSAGE[warnCode];
};
