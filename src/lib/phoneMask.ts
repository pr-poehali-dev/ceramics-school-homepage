/**
 * Форматирует ввод телефона в маску +7 (999) 999-99-99 по мере набора.
 * Понимает начало с 8, 7 или без кода страны — всегда приводит к +7.
 */
export function formatPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  } else if (!digits.startsWith('7') && digits.length > 0) {
    digits = '7' + digits;
  }

  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';

  const rest = digits.slice(1);
  let result = '+7';

  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) result += ')';
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`;

  return result;
}
