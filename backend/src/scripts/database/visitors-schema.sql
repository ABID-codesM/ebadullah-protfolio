-- ============================================================
-- PORTFOLIO VISITOR ANALYTICS
-- Phase 7.1 - Database Schema
-- PostgreSQL
-- ============================================================

BEGIN;

-- ============================================================
-- 1. VISITORS
-- Stores anonymous browser visitor identities
-- ============================================================

CREATE TABLE IF NOT EXISTS visitors (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

visitor_id UUID NOT NULL UNIQUE,

first_seen_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
last_seen_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT visitors_last_seen_check
    CHECK (last_seen_at >= first_seen_at)

);

-- ============================================================
-- 2. VISITOR SESSIONS
-- Each visitor can have multiple sessions
-- ============================================================

CREATE TABLE IF NOT EXISTS visitor_sessions (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

session_id UUID NOT NULL UNIQUE,

visitor_id BIGINT NOT NULL
    REFERENCES visitors(id)
    ON DELETE CASCADE,

started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

last_activity_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

ended_at TIMESTAMPTZ,

-- Traffic attribution
source VARCHAR(100),
medium VARCHAR(100),
campaign VARCHAR(150),
referrer_domain VARCHAR(255),

-- Device information
device_type VARCHAR(20),
browser VARCHAR(100),
operating_system VARCHAR(100),

created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT visitor_sessions_device_type_check
    CHECK (
        device_type IS NULL
        OR device_type IN (
            'desktop',
            'mobile',
            'tablet',
            'other'
        )
    ),

CONSTRAINT visitor_sessions_activity_check
    CHECK (last_activity_at >= started_at),

CONSTRAINT visitor_sessions_ended_check
    CHECK (
        ended_at IS NULL
        OR ended_at >= started_at
    )

);

-- ============================================================
-- 3. PAGE VIEWS
-- Stores pages viewed during each session
-- ============================================================

CREATE TABLE IF NOT EXISTS page_views (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

session_id BIGINT NOT NULL
    REFERENCES visitor_sessions(id)
    ON DELETE CASCADE,

page_path VARCHAR(500) NOT NULL,

page_title VARCHAR(300),

viewed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

duration_seconds INTEGER,

created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT page_views_path_check
    CHECK (length(trim(page_path)) > 0),

CONSTRAINT page_views_duration_check
    CHECK (
        duration_seconds IS NULL
        OR duration_seconds >= 0
    )

);

-- ============================================================
-- 4. VISITOR EVENTS
-- Stores selected meaningful visitor interactions
-- ============================================================

CREATE TABLE IF NOT EXISTS visitor_events (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

session_id BIGINT NOT NULL
    REFERENCES visitor_sessions(id)
    ON DELETE CASCADE,

event_name VARCHAR(100) NOT NULL,

event_category VARCHAR(100),

page_path VARCHAR(500),

event_data JSONB NOT NULL DEFAULT '{}'::jsonb,

occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT visitor_events_name_check
    CHECK (length(trim(event_name)) > 0),

CONSTRAINT visitor_events_data_check
    CHECK (jsonb_typeof(event_data) = 'object')

);

-- ============================================================
-- INDEXES
-- ============================================================

-- Visitors
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen
ON visitors (last_seen_at DESC);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor
ON visitor_sessions (visitor_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_started
ON visitor_sessions (started_at DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_active
ON visitor_sessions (last_activity_at DESC)
WHERE ended_at IS NULL;

-- Page Views
CREATE INDEX IF NOT EXISTS idx_page_views_session
ON page_views (session_id, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_views_viewed
ON page_views (viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_views_path
ON page_views (page_path);

-- Visitor Events
CREATE INDEX IF NOT EXISTS idx_visitor_events_session
ON visitor_events (session_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_events_occurred
ON visitor_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_events_name
ON visitor_events (event_name);

COMMIT;



پپپپپپپپ

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
      'visitors',
      'visitor_sessions',
      'page_views',
      'visitor_events'
  )
ORDER BY table_name;


ټټټټټ

SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
      'visitors',
      'visitor_sessions',
      'page_views',
      'visitor_events'
  )
ORDER BY table_name, ordinal_position;


ټټټټ
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
      'visitors',
      'visitor_sessions',
      'page_views',
      'visitor_events'
  )
ORDER BY tablename, indexname;

ټټټ

