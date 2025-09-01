# Technology Stack

## Build System
- **Monorepo**: Turborepo for build orchestration and caching
- **Package Manager**: Yarn 4.0.2 with workspaces
- **Language**: TypeScript 5.3+ throughout the entire stack

## Frontend Frameworks
- **Mobile**: React Native 0.72+ with Expo
- **Web**: Next.js with React 18.2+
- **UI Library**: Tamagui for cross-platform components
- **State Management**: React Context API

## Backend & Services
- **API**: Express.js with tRPC for type-safe endpoints
- **Authentication**: Firebase Auth
- **Database**: MongoDB with Zod for schema validation
- **Admin SDK**: Firebase Admin for server-side operations

## Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode enabled

## Common Commands

### Development
```bash
yarn dev          # Start all apps in development mode
yarn build        # Build all packages and apps
yarn type-check   # Run TypeScript checks across workspace
yarn lint         # Lint all code
yarn clean        # Clean build artifacts
```

### Package-Specific Development
```bash
# API server
cd apps/api && yarn dev

# Individual package builds
cd packages/[package-name] && yarn build
```

## Environment Setup
- Requires `.env.local` file in root for environment variables
- Firebase configuration needed for authentication
- MongoDB connection string required for database operations