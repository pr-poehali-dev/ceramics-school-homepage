/**
 * Сжимает изображение на клиенте перед загрузкой: уменьшает разрешение до maxDimension
 * по большей стороне и пережимает в JPEG с заданным качеством. Это нужно, чтобы фото,
 * снятое прямо на камеру телефона (часто 5-15 МБ, а на iPhone ещё и в формате HEIC),
 * не превышало лимиты на сервере и грузилось быстро даже на медленном мобильном интернете.
 *
 * Использует createImageBitmap (умеет декодировать HEIC/HEIF в Safari на iPhone) с фолбэком
 * на классический <img>, чтобы поддержать максимум браузеров и форматов камеры.
 *
 * Возвращает base64 data URL (image/jpeg) и приблизительный размер в байтах.
 * Если браузер совсем не может декодировать формат (редкие кастомные форматы) — бросает
 * понятную ошибку с рекомендацией выбрать другое фото.
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82,
): Promise<{ dataUrl: string; sizeBytes: number }> {
  const bitmap = await decodeToBitmapOrImage(file);

  let { width, height } = bitmap;
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
    throw new Error('Ваш браузер не поддерживает обработку изображений. Попробуйте другой браузер.');
  }

  try {
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, width, height);
  } catch {
    throw new Error(
      'Не удалось обработать это фото. Попробуйте выбрать другой формат (JPG или PNG) или сделать новый снимок.',
    );
  }

  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  if (!dataUrl || dataUrl === 'data:,') {
    throw new Error(
      'Не удалось сжать это фото. Попробуйте выбрать другой формат (JPG или PNG) или сделать новый снимок.',
    );
  }
  const base64Length = dataUrl.split(',')[1]?.length || 0;
  const sizeBytes = Math.round((base64Length * 3) / 4);
  return { dataUrl, sizeBytes };
}

async function decodeToBitmapOrImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Некоторые браузеры не умеют createImageBitmap для конкретного формата (например
      // старый Chrome для HEIC) — пробуем классический способ через <img> ниже.
    }
  }

  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось прочитать файл. Попробуйте выбрать фото заново.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () =>
        reject(
          new Error(
            'Этот формат фото не поддерживается браузером (например HEIC с iPhone). ' +
              'В настройках камеры iPhone включите «Наиболее совместимые» (Настройки → Камера → Форматы) ' +
              'или выберите фото в формате JPG/PNG.',
          ),
        );
      img.onload = () => resolve(img);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
