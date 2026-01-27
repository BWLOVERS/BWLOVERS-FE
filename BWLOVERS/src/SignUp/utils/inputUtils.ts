export const onlyDigits = (v: string) => v.replace(/\D/g, '');

export const isDate8 = (v: string) => /^\d{8}$/.test(v);

export const sliceTo8Digits = (v: string) => onlyDigits(v).slice(0, 8);
