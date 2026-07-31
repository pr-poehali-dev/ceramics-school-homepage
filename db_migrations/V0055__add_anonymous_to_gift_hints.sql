ALTER TABLE t_p90609946_ceramics_school_home.gift_hints
    ADD COLUMN anonymous BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN t_p90609946_ceramics_school_home.gift_hints.anonymous IS
  'Отправитель попросил не сохранять своё имя (форма "Отправить анонимно")';