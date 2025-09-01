# Project Structure

## Monorepo Organization

This is a Turborepo monorepo with clear separation between applications and shared packages.

### Apps (`/apps`)
- **`apps/api/`** - Express.js API server with tRPC endpoints
- **`apps/expo/`** - React Native mobile application
- **`apps/next/`** - Next.js web application

### Packages (`/packages`)
- **`packages/app/`** - Shared React/React Native business logic and contexts
- **`packages/database/`** - MongoDB models, services, and database utilities
- **`packages/firebase/`** - Firebase configuration and authentication utilities
- **`packages/shared/`** - Common types, constants, and utilities
- **`packages/ui/`** - Tamagui-based cross-platform UI components

## Package Naming Convention
All packages use the `@couple-app/` namespace:
- `@couple-app/app`
- `@couple-app/database` 
- `@couple-app/firebase`
- `@couple-app/shared`
- `@couple-app/ui`

## File Organization Patterns

### Standard Package Structure
```
packages/[package-name]/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Business logic services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── index.ts        # Package exports
├── package.json
└── tsconfig.json
```

### API Structure
```
apps/api/src/
├── config/            # Configuration files
├── middleware/        # Express middleware
├── routers/           # tRPC route definitions
├── services/          # Business logic services
├── trpc/              # tRPC setup and context
├── index.ts           # Application entry point
└── server.ts          # Express server setup
```

## Import Conventions
- Use package aliases: `@couple-app/[package-name]`
- Relative imports within the same package
- Barrel exports from `index.ts` files for clean imports

## Code Organization Rules
- Keep components focused and single-responsibility
- Separate business logic into services
- Use TypeScript interfaces for all data structures
- Export types and utilities through package index files
- Maintain consistent folder naming (lowercase with hyphens)