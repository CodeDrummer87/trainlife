CREATE TABLE IF NOT EXISTS service_types (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(13) NOT NULL
);

INSERT INTO service_types (title)
VALUES
    ('грузовое'),
    ('пассажирское'),
    ('хозяйственное'),
    ('маневровое');