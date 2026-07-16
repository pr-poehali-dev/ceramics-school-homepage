import { City } from '@/lib/cities';

declare global {
  interface Window {
    ym?: (
      counterId: number,
      action: string,
      goalOrUrl?: string | Record<string, unknown>,
      params?: Record<string, unknown>,
    ) => void;
  }
}

const METRIKA_COUNTER_ID = 48787754;

/**
 * Отправляет просмотр страницы (hit) в Яндекс.Метрику при переходах внутри SPA.
 * Тег в index.html фиксирует только первую загрузку — при смене маршрута
 * React Router не перезагружает страницу, поэтому переходы нужно отправлять вручную.
 */
export const trackPageview = (url: string) => {
  try {
    window.ym?.(METRIKA_COUNTER_ID, 'hit', url, { referer: document.referrer });
  } catch {
    // Метрика не должна ломать пользовательский флоу.
  }
};

/** Базовые названия целей — к каждой при отправке добавляется город: _moscow или _suzdal. */
export const GOALS = {
  ORDER_SUBMIT: 'order_submit',
  PAYMENT_START: 'payment_start',
  PAYMENT_SUCCESS: 'payment_success',
  CERTIFICATE_ADD: 'certificate_add',
  QUESTION_SUBMIT: 'question_submit',
  BOOKING_CLICK: 'booking_click',
  BOOKING_WIDGET_LOADED: 'booking_widget_loaded',
  BOOKING_WIDGET_CLOSED: 'booking_widget_closed',
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
} as const;

/**
 * Отправляет цель в Яндекс.Метрику с учётом города — итоговая цель будет
 * называться `<goal>_moscow` или `<goal>_suzdal`.
 */
export const reachGoal = (goal: string, city: City, params?: Record<string, unknown>) => {
  try {
    window.ym?.(METRIKA_COUNTER_ID, 'reachGoal', `${goal}_${city}`, params);
  } catch {
    // Метрика не должна ломать пользовательский флоу.
  }
};