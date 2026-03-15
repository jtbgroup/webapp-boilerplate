-- Use case: UC-02

CREATE TABLE IF NOT EXISTS user_audit (
    id           UUID         PRIMARY KEY,
    action       TEXT         NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    target_user  VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    details      TEXT
);
