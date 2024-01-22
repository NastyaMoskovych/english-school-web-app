export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const getTypeFromBase64 = (base64: string): string => {
  return base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] as string;
};
