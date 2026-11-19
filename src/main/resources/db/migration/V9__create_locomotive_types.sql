CREATE TABLE IF NOT EXISTS locomotive_types (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(12) NOT NULL
);

INSERT INTO locomotive_types (title)
VALUES
    ('Электровоз'),
    ('Тепловоз'),
    ('Газотурбовоз'),
    ('Паровоз');