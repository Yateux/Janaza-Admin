# Janaza Admin Panel

Modern administration panel for the Janaza platform (Muslim funeral services).

## Tech Stack

- **React 18+** with TypeScript
- **Vite** as bundler
- **React Router v6** for routing
- **TanStack Query (React Query)** for API call management
- **Axios** for HTTP requests
- **Zustand** for state management
- **shadcn/ui + Tailwind CSS** for UI components
- **React Hook Form + Zod** for form validation

## Prerequisites

- Node.js 18+
- pnpm 8+ (installed globally: `npm install -g pnpm`)
- Janaza Backend API (NestJS) running

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Modify environment variables if needed
# VITE_API_URL=http://localhost:3000/
```

## Development

```bash
# Start development server
pnpm dev

# The application will be available at http://localhost:5173
```

## Production Build

```bash
# Build for production
pnpm build

# Preview the build
pnpm preview
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Check TypeScript types

## Login

Only users with the **Admin** role can log in to the administration panel.

## Features

### 📊 Dashboard
- General statistics (users, announcements, reports)
- Latest created announcements
- Unresolved reports

### 👥 User Management
- Complete list with search and filters
- Create/edit/delete users
- Detailed view with activity history

### 📢 Announcement Management
- List of active and expired announcements
- Complete details with location
- Comment management
- Mark as expired
- Delete with reason

### 🚨 Report Management
- List of pending and resolved reports
- Resolution with admin notes
- Delete announcement directly from report

### 🏷️ Reason Management
- Full CRUD for deletion reasons
- Classification by type and category
- Activation/deactivation

### 🔔 Notification Management
- Send push notifications to a user
- Broadcast to all users
- Push token management
- Device history

## Security

- JWT authentication
- Admin role verification at multiple levels
- Route protection
- 401/403 error handling
- Client-side and server-side form validation

## Architecture

```
src/
├── api/              # API configuration and React Query hooks
├── components/       # React components
│   ├── ui/          # UI components (shadcn/ui)
│   ├── layout/      # App layout (Sidebar, Header)
│   └── [feature]/   # Feature-specific components
├── lib/             # Utilities and validations
├── pages/           # Application pages
├── routes/          # Routing configuration
├── stores/          # Zustand stores
└── types/           # TypeScript types
```

## Contributing

1. Create a branch from `main`
2. Develop the feature
3. Test locally
4. Create a Pull Request

## Support

For any questions or issues, contact the development team.
