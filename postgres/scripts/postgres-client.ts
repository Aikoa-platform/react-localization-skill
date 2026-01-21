#!/usr/bin/env bun
import { SQL } from "bun";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const POSTGRES_URL_ENV = "POSTGRES_URL";
const READ_ONLY_ENV = "POSTGRES_READ_ONLY";
type Args = {
  query?: string;
  file?: string;
  params?: unknown[];
  format: "json" | "table";
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { format: "json", help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    switch (current) {
      case "--help":
      case "-h":
        args.help = true;
        break;
      case "--query":
      case "-q":
        args.query = argv[i + 1];
        i += 1;
        break;
      case "--file":
      case "-f":
        args.file = argv[i + 1];
        i += 1;
        break;
      case "--params":
        args.params = parseParams(argv[i + 1]);
        i += 1;
        break;
      case "--format":
        args.format = (argv[i + 1] as Args["format"]) ?? "json";
        i += 1;
        break;
      default:
        if (!current.startsWith("-") && !args.query) {
          args.query = current;
        }
        break;
    }
  }
  return args;
}

function parseParams(raw?: string): unknown[] {
  if (!raw) {
    return [];
  }
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("--params must be a JSON array");
  }
  return parsed;
}

function parseReadOnly(value?: string): boolean {
  if (!value) {
    return true;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  console.warn(
    `Unrecognized ${READ_ONLY_ENV} value "${value}". Defaulting to read-only.`,
  );
  return true;
}

const MUTATING_REGEX =
  /\b(insert|update|delete|alter|create|drop|truncate|grant|revoke|comment|set|vacuum|analyze|refresh|merge|call|copy|cluster|reindex)\b/i;

function isMutatingQuery(query: string): boolean {
  const stripped = query
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  return MUTATING_REGEX.test(stripped);
}

function printUsage(): void {
  console.log(`Postgres client (Bun SQL)

Usage:
  bun scripts/postgres-client.ts --query "SELECT 1"
  bun scripts/postgres-client.ts --file ./path/to/query.sql

Options:
  --query, -q   SQL query string
  --file, -f    Path to a .sql file
  --params      JSON array for parameterized sql.unsafe
  --format      json (default) or table
  --help, -h    Show help

Environment:
  ${POSTGRES_URL_ENV}     Postgres connection URL
  ${READ_ONLY_ENV}  "true" or "false" (default "true")
`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  const connectionUrl = process.env[POSTGRES_URL_ENV];
  if (!connectionUrl) {
    console.error(
      `Missing ${POSTGRES_URL_ENV}. Set it in your environment or .env file.`,
    );
    process.exit(1);
  }

  if (args.query && args.file) {
    console.error("Provide either --query or --file, not both.");
    process.exit(1);
  }

  let query = args.query ?? "";
  if (args.file) {
    const filePath = resolve(process.cwd(), args.file);
    query = readFileSync(filePath, "utf8");
  }

  if (!query.trim()) {
    console.error("No SQL provided. Use --query or --file.");
    process.exit(1);
  }

  const readOnly = parseReadOnly(process.env[READ_ONLY_ENV]);
  if (readOnly && isMutatingQuery(query)) {
    console.error(
      `Blocked mutating query while ${READ_ONLY_ENV} is true. Set ${READ_ONLY_ENV}=false to allow writes.`,
    );
    process.exit(1);
  }

  const sql = new SQL(connectionUrl);
  try {
    const result =
      args.params && args.params.length > 0
        ? await sql.unsafe(query, args.params)
        : await sql.unsafe(query);

    if (args.format === "table" && Array.isArray(result)) {
      console.table(result);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } finally {
    await sql.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
