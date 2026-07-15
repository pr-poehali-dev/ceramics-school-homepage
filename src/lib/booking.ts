import { reachGoal, GOALS } from '@/lib/metrika';

export const YCLIENTS_URL = 'https://n248670.yclients.com/';

const BOOKING_EVENT = 'open-booking';

/** Открывает панель онлайн-записи (drawer справа). */
export const openBooking = () => {
  reachGoal(GOALS.BOOKING_CLICK);
  window.dispatchEvent(new CustomEvent(BOOKING_EVENT));
};

export const BOOKING_EVENT_NAME = BOOKING_EVENT;