CREATE TABLE IF NOT EXISTS traction_kinds (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(12) NOT NULL
);

INSERT INTO traction_kinds (title)
VALUES
    ('электровоз'),
    ('тепловоз'),
    ('газотурбовоз');