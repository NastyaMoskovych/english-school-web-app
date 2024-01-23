export const getTypeFromBase64 = (base64: string): string => {
  return base64
    .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0]
    .split('/')
    .pop() as string;
};
