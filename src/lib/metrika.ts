declare global {
  interface Window {
    ym?: (counterId: number, action: string, goal: string, params?: Record<string, unknown>) => void;
  }
}

const METRIKA_COUNTER_ID = 48787754;

/** Ключевые цели, которые отслеживаются в Яндекс.Метрике. */
export const GOALS = {
  ORDER_SUBMIT: 'order_submit',
  PAYMENT_START: 'payment_start',
  PAYMENT_SUCCESS: 'payment_success',
  CERTIFICATE_ADD: 'certificate_add',
  QUESTION_SUBMIT: 'question_submit',
  BOOKING_CLICK: 'booking_click',
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
} as const;

/** Отправляет цель в Яндекс.Метрику (если счётчик загружен на странице). */
export const reachGoal = (goal: string, params?: Record<string, unknown>) => {
  try {
    window.ym?.(METRIKA_COUNTER_ID, 'reachGoal', goal, params);
  } catch {
    // Метрика не должна ломать пользовательский флоу.
  }
};
