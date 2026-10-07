CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL DEFAULT '',
    updated_at TEXT
);

INSERT OR IGNORE INTO documents (
    id,
    content,
    updated_at
)
VALUES (
    1,
    '',
    datetime('now')
);