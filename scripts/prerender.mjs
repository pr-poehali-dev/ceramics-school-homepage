/**
 * Пререндер (SSG) страниц сайта под SEO.
 *
 * 1. Собирает клиентский бандл (vite build) — уже должен быть готов в dist/.
 * 2. Собирает SSR-бандл entry-server.tsx во временную папку dist-ssr/.
 * 3. Для каждого маршрута из scripts/prerender-routes.mjs рендерит HTML
 *    страницы через renderToString() и подставляет его в шаблон dist/index.html,
 *    а также заменяет title/description/og-теги на уникальные для страницы.
 * 4. Результат сохраняет как dist/<path>/index.html — так статический хостинг
 *    отдаёт краулерам готовый HTML без выполнения JavaScript.
 *
 * Служебные страницы (корзина, чекаут, статус заказа, админка, 404) не
 * пререндерятся — им SEO не нужен, у них есть noindex или это приватные страницы.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRERENDER_ROUTES } from './prerender-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrOutDir = path.join(root, 'dist-ssr');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSsrBundle() {
  console.log('[prerender] Собираю SSR-бандл...');
  const viteBin = path.join(root, 'node_modules', '.bin', 'vite');
  execSync(
    `"${viteBin}" build --ssr src/entry-server.tsx --outDir dist-ssr --minify esbuild`,
    { cwd: root, stdio: 'inherit' },
  );
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('[prerender] dist/ не найден. Сначала выполните обычную сборку (vite build).');
    process.exit(1);
  }

  buildSsrBundle();

  const entryPath = path.join(ssrOutDir, 'entry-server.js');
  if (!existsSync(entryPath)) {
    console.error(`[prerender] Не найден SSR-бандл: ${entryPath}`);
    process.exit(1);
  }

  const { render } = await import(`file://${entryPath}`);
  const template = readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  let ok = 0;
  let failed = 0;

  for (const route of PRERENDER_ROUTES) {
    try {
      const appHtml = render(route.path);

      let html = template;
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${escapeHtml(route.title)}</title>`,
      );
      html = html.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${escapeHtml(route.description)}">`,
      );
      html = html.replace(
        /<meta property="og:title" content=".*?">/,
        `<meta property="og:title" content="${escapeHtml(route.title)}">`,
      );
      html = html.replace(
        /<meta property="og:description" content=".*?">/,
        `<meta property="og:description" content="${escapeHtml(route.description)}">`,
      );
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`,
      );

      const outPath =
        route.path === '/'
          ? path.join(distDir, 'index.html')
          : path.join(distDir, route.path.replace(/^\//, ''), 'index.html');

      mkdirSync(path.dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf-8');
      ok++;
    } catch (err) {
      failed++;
      console.error(`[prerender] Ошибка на ${route.path}:`, err.message);
    }
  }

  rmSync(ssrOutDir, { recursive: true, force: true });

  console.log(`[prerender] Готово: ${ok} страниц, ошибок: ${failed}`);
  if (failed > 0) process.exit(1);
}

main();