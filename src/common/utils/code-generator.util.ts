export const generateCode = (codeLength: number = 4): string => {
  const number = String(Math.random()).split('.')[1]?.slice(0, codeLength) || '';
  return number.padEnd(codeLength, '0');
};
