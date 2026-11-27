CREATE TABLE IF NOT EXISTS railway_regions(
    id BIGSERIAL PRIMARY KEY,
    railway_id BIGINT NOT NULL,
    title VARCHAR(50) NOT NULL UNIQUE,

    FOREIGN KEY (railway_id) REFERENCES railways (id) ON DELETE CASCADE
);

INSERT INTO railway_regions (railway_id, title)
VALUES
    --- ВСЖД ---
    (1, 'Северобайкальский'),
    (1, 'Тайшетский'),
    (1, 'Иркутский'),
    (1, 'Улан-Удэнский'),

    --- ГЖД ---
    (2, 'Горьковский'),
    (2, 'Ижевский'),
    (2, 'Казанский'),
    (2, 'Кировский'),
    (2, 'Муромский');