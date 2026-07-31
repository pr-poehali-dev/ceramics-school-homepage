import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { reachGoal, GOALS } from '@/lib/metrika';

/**
 * Короткая ссылка /tracking/qr для QR-кода на столах в школе (Москва, ВДНХ).
 * Отправляет цель в Яндекс.Метрику (сколько раз отсканировали код со стола)
 * и сразу перенаправляет на форму «Добавить заявку» отслеживания изделий.
 */
const QrRedirect = () => {
  useEffect(() => {
    reachGoal(GOALS.QR_TABLE_SCAN, 'moscow');
  }, []);

  return <Navigate to="/tracking?mode=add&src=qr" replace />;
};

export default QrRedirect;

/**
 * Короткая ссылка /tracking/qr-suzdal для QR-кода на столах в школе керамики
 * в Суздале. Отправляет цель в Яндекс.Метрику и перенаправляет на форму
 * «Добавить заявку» отслеживания изделий, сразу с городом Суздаль.
 */
export const QrRedirectSuzdal = () => {
  useEffect(() => {
    reachGoal(GOALS.QR_TABLE_SCAN, 'suzdal');
  }, []);

  return <Navigate to="/tracking?mode=add&city=suzdal&src=qr" replace />;
};