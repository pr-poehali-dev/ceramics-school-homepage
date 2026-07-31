import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Страховка от белого экрана на вкладках, "уснувших" до обновления сайта:
// если браузер не может подгрузить файл страницы (его заменили новым при
// деплое), Vite сообщает об этом событием — просто перезагружаем страницу,
// чтобы подтянуть актуальную версию файлов.
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(<App />);