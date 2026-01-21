# React Localization Skill

A customizable Agent Skill for finding and localizing hardcoded user-facing strings in React applications. This skill uses [i18next-cli](https://github.com/i18next/i18next-cli) to detect untranslated strings and guides AI agents through the process of moving them to proper i18n translation files.

## Features

- **Automated Detection**: Uses i18next-cli's powerful linter to find hardcoded strings
- **Self-Contained**: Includes a bundled script that works independently of project configuration
- **Type Generation**: Automatically regenerates TypeScript types for translation keys
- **Customizable**: Adapts to your project's structure, package manager, and i18n setup
- **Modular Documentation**: Organized reference files for detailed guidance

## Installation

### Using Taito CLI (Recommended)

Install and customize for your project:

```bash
taito add aikoa-platform/react-localization-skill
```

You'll be prompted to configure:

- Source language and language code
- Translation file path pattern
- t() function format (string vs callback)
- Supported languages
- Package manager
- Project commands (optional)

### Non-Interactive Installation

Create a config file with your settings:

```toml
# localization-config.toml
SOURCE_LANGUAGE = "English"
SOURCE_LANGUAGE_CODE = "en"
TRANSLATION_PATH = "src/locales/{{namespace}}/{{language}}.json"
I18N_IMPORT = "react-i18next"
T_FUNCTION_FORMAT = "string"
SUPPORTED_LANGUAGES = ["en", "de", "fr"]
PACKAGE_MANAGER = "npm"
LINT_COMMAND = "npm run lint"
TYPECHECK_COMMAND = "npm run typecheck"
SOURCE_GLOB = "src/**/*.{ts,tsx}"
```

Then install:

```bash
taito add aikoa-platform/react-localization-skill --config ./localization-config.toml
```

## Usage

Once installed, ask your AI agent to localize your app:

```
"Localize the user profile page"
"Find and translate all hardcoded strings in src/components"
"Add i18n support to the app"
```

The agent will:

1. Run the i18next-cli linter to find hardcoded strings
2. Determine appropriate namespaces for each string
3. Add keys to translation JSON files
4. Replace hardcoded strings with `t()` calls
5. Regenerate TypeScript types
6. Verify with your project's lint and typecheck commands

## How It Works

### Bundled Script

The skill includes a self-contained `i18next-lint.mjs` script that provides:

```bash
# Find hardcoded strings
npx tsx scripts/i18next-lint.mjs lint

# Regenerate i18n types
npx tsx scripts/i18next-lint.mjs types
```

This script uses i18next-cli programmatically and is configured based on your installation settings.

### Reference Documentation

The skill includes detailed reference files:

- **WORKFLOW.md** - Step-by-step localization process
- **T-FUNCTION.md** - How to use the t() function (string vs callback format)
- **LOCALIZATION-FILES.md** - Namespace organization and file structure
- **I18NEXT-CONFIG.md** - Optional i18next.config.ts setup

## Project Requirements

- React project with TypeScript
- i18next/react-i18next for translations
- Node.js 16+ (for running the bundled script)

## Customization

This is a customizable skill using the [Taito CLI format](https://github.com/taitodev/taito).

The `.taito/` folder contains:

- `skill.config.toml` - Variable definitions
- `SKILL.md.ejs` - Main skill template
- `scripts/i18next-lint.mjs.ejs` - Script template
- `references/*.md.ejs` - Reference documentation templates

To modify the skill for your needs:

1. Edit templates in `.taito/`
2. Run `taito build react-localization/` to regenerate default files
3. The default files work with standard skill installers

## Example

**Before localization:**

```tsx
function UserCard() {
  return <Button>Save Changes</Button>;
}
```

**After localization:**

```tsx
import { useTranslation } from "react-i18next";

function UserCard() {
  const { t } = useTranslation("common");
  return <Button>{t("button.save")}</Button>;
}
```

**Translation file (`common/en.json`):**

```json
{
  "button": {
    "save": "Save Changes"
  }
}
```

## Contributing

This skill is part of the Aikoa skill collection. Contributions are welcome!

## License

MIT
