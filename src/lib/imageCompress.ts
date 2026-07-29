/**
 * Сжимает изображение на клиенте перед загрузкой: уменьшает разрешение до maxDimension
 * по большей стороне и пережимает в JPEG с заданным качеством. Это нужно, чтобы фото,
 * снятое прямо на камеру телефона (часто 5-15 МБ), не превышало лимиты на отправку/сервере
 * и грузилось быстро даже на медленном мобильном интернете.
 * Возвращает base64 data URL (image/jpeg) и приблизительный размер в байтах.
 */
export function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82,
): Promise<{ dataUrl: string; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Не удалось обработать изображение'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas недоступен'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Length = dataUrl.split(',')[1]?.length || 0;
        const sizeBytes = Math.round((base64Length * 3) / 4);
        resolve({ dataUrl, sizeBytes });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
