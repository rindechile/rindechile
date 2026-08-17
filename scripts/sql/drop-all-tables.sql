-- Drops all application tables plus the migration bookkeeping table.
-- Order matters: children before parents, since FK constraints may be enforced.
-- d1_migrations is dropped last so that a following
-- `wrangler d1 migrations apply --local` re-applies the full schema instead of
-- reporting "No migrations to apply!" against an empty database.
-- _cf_METADATA is Cloudflare-internal and is deliberately left alone.

DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS document_scrapes;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS municipalities;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS commodities;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS families;
DROP TABLE IF EXISTS segments;
DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS d1_migrations;
