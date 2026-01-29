# Jacon - Operations Platform

Unified Docker & Kubernetes Management platform built with Next.js.

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5
- **React**: 19.2.3 with React Compiler (babel-plugin-react-compiler)
- **Styling**: Tailwind CSS 3.4 + CSS Modules
- **Utilities**: clsx for class name composition

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (users, settings, audit)
│   ├── config/             # Configuration management
│   ├── dashboard/          # Main dashboard
│   ├── deploy/             # Deployment page
│   ├── edge/               # Edge computing
│   ├── endpoints/          # Endpoint management
│   ├── gitops/             # GitOps workflows
│   ├── inventory/          # Resource inventory
│   ├── login/              # Authentication
│   ├── observability/      # Monitoring & logs
│   ├── policy/             # Policy management
│   ├── profile/            # User profile
│   ├── settings/           # App settings (registries, IAM, policy)
│   ├── stacks/             # Stack management
│   └── workloads/          # Workload management
├── components/
│   ├── features/           # Feature-specific components
│   │   ├── auth/           # Authentication (AuthContext, LoginForm)
│   │   ├── config/         # Config editor & list
│   │   ├── dashboard/      # Activity feed
│   │   ├── endpoints/      # Endpoint list
│   │   ├── governance/     # Drift detection
│   │   ├── inventory/      # Resource details
│   │   ├── layout/         # Project switcher
│   │   ├── observability/  # Charts, logs, terminal
│   │   ├── policy/         # Role list, audit log
│   │   ├── profile/        # Profile tabs
│   │   └── workloads/      # Workload components
│   ├── layout/             # Layout components (Header, Sidebar, MainLayout)
│   └── ui/                 # Reusable UI components
│       ├── button.tsx      # Button component
│       ├── card.tsx        # Card component
│       ├── diff-viewer.tsx # Diff viewer
│       ├── input.tsx       # Input component
│       ├── label.tsx       # Label component
│       ├── switch.tsx      # Toggle switch
│       ├── tabs.tsx        # Tab component
│       └── tree-view.tsx   # Tree view component
├── hooks/                  # Custom React hooks
│   └── use-project-context.tsx  # Project context hook
├── lib/                    # Utilities and mock data
│   ├── utils.ts            # Utility functions (cn for classnames)
│   ├── auth.ts             # Auth utilities
│   ├── auth-actions.ts     # Auth server actions
│   ├── db.ts               # Database utilities
│   ├── policy-engine.ts    # Policy engine
│   └── mock-*.ts           # Mock data files
└── types/                  # TypeScript type definitions
    └── index.ts            # Shared types
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Code Conventions

### Imports
- Use `@/*` path alias for imports from `src/` directory
- Example: `import { cn } from "@/lib/utils"`

### Styling
- Use Tailwind CSS for utility classes
- Use CSS Modules (*.module.css) for component-specific styles
- Use `cn()` utility from `@/lib/utils` for conditional class names

### Components
- UI components go in `src/components/ui/`
- Feature-specific components go in `src/components/features/{feature}/`
- Layout components go in `src/components/layout/`
- Each component may have an accompanying `.module.css` file

### State Management
- `AuthProvider` wraps the app for authentication state
- `ProjectProvider` provides project context
- Use React Context for global state

### Types
- Shared types in `src/types/index.ts`
- Component props should extend `BaseComponentProps` when applicable

### File Naming
- React components: PascalCase (e.g., `Button.tsx`)
- Utilities/hooks: kebab-case (e.g., `use-project-context.tsx`)
- CSS modules: same name as component with `.module.css` suffix
