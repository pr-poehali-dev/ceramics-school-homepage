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
