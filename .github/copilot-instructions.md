# AI Agent Instructions for Local-Translator

This is a Chrome extension built with Plasmo framework for providing local AI-powered translations. Here's what you need to know to work effectively with this codebase:

## Project Architecture

### Core Components

- **Content Script** (`src/content.tsx`): Main entry point that handles text selection and translation flow
- **Components** (`src/components/`): React components for UI elements like translation card, language selector
- **Services** (`src/services/`): Core services for translation and speech synthesis
- **Hooks** (`src/hooks/`): Custom React hooks managing state and business logic
- **Utils** (`src/utils/`): Utility functions including language detection and settings management

### Key Data Flows

1. Text Selection → Language Detection → Translation → UI Display
2. Settings changes → Storage → UI Updates
3. Text → Speech Synthesis → Audio Output

## Development Workflow

### Local Development

```bash
pnpm dev     # Start development server
# Load unpacked extension from build/chrome-mv3-dev/
```

### Production Build

```bash
pnpm build   # Create production bundle
pnpm package # Package for store submission
```

## Project-Specific Patterns

### State Management

- Uses React hooks pattern for state management (see `useSettings`, `useTranslation`)
- Translation state flow: `selectedText → sourceLang → targetLang → result`

### Component Conventions

- Feature-specific hooks for business logic separation (e.g., `useSpeech.ts`, `useTranslation.ts`)
- UI components are functional React components with TypeScript
- Translation-related components use common interfaces from `types/index.ts`

### Configuration

- Extension settings stored in Chrome storage (see `utils/settings.ts`)
- Language detection uses custom detector in `utils/lan_detector/`
- Translation service configurable through `services/translation_service.ts`

## Integration Points

- Chrome Extension APIs: Storage, Runtime messaging
- External services: AI translation backend (configured in translation service)
- Browser text selection API for content script interaction

## Common Tasks

- Adding new translation service: Extend `translators/local_ai_translator.ts`
- Modifying UI components: Check `components/` directory
- Updating settings: Modify `utils/settings.ts` and `hooks/useSettings.ts`

## Architecture Decisions

- Uses Plasmo framework for simplified extension development
- Content script architecture for real-time translation
- Local AI model integration for privacy-focused translation
