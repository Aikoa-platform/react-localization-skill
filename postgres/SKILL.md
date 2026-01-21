---
name: postgres
description: Query and interact with PostgreSQL databases using Bun's built-in SQL client. Use when you need to run Postgres queries for a project that provides a connection URL.
---

# Postgres (Bun SQL)

Use this skill to run Postgres queries via Bun's built-in SQL client.

## Requirements
1. Check that Bun is installed. If `bun --version` fails, tell the user to install Bun: https://bun.sh
2. Run the client from the project root so `.env` is loaded.

## Environment
- `POSTGRES_URL`: Postgres connection URL (customizable at install time).
- `POSTGRES_READ_ONLY`: "true" or "false" (default "true"). When "true", the client blocks mutating statements.

## Run the client
Use bun directly to run the client:

`bun scripts/postgres-client.ts --query "SELECT 1"`

Examples:
`bun scripts/postgres-client.ts --query "SELECT NOW() AS time"`
`bun scripts/postgres-client.ts --file ./sql/users.sql`

## Output
The client prints JSON by default. Use `--format table` for a table view.

## References
See `references/POSTGRES-CLIENT.md` and `rules/POSTGRES-RULES.md`.
