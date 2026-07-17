import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import AppRoutesSSR from '@/AppRoutesSSR';

/** Рендерит дерево страницы в HTML-строку для заданного пути (используется скриптом пререндера). */
export function render(url: string): string {
  const queryClient = new QueryClient();
  return renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <StaticRouter location={url}>
              <AppRoutesSSR />
            </StaticRouter>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}