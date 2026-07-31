ALTER TABLE t_p90609946_ceramics_school_home.blog_posts
    ADD COLUMN gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN t_p90609946_ceramics_school_home.blog_posts.gallery IS
  'Доп. фотографии статьи (галерея внизу текста) — массив URL картинок';