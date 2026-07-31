CREATE TABLE t_p90609946_ceramics_school_home.blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    excerpt TEXT NULL,
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    created_by INTEGER NULL REFERENCES t_p90609946_ceramics_school_home.managers(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    published_at TIMESTAMP NULL
);

CREATE INDEX idx_blog_posts_published ON t_p90609946_ceramics_school_home.blog_posts(published, published_at);

COMMENT ON TABLE t_p90609946_ceramics_school_home.blog_posts IS
  'Статьи/новости блога сайта — общий блог на оба города (Москва и Суздаль), управляется через админку менеджером ВДНХ';