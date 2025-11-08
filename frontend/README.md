# Tundua SaaS Frontend

Next.js 14 frontend application for the Tundua Study Abroad SaaS Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your configuration

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication pages
│   │   ├── apply/          # Application wizard
│   │   ├── dashboard/      # User dashboard
│   │   ├── admin/          # Admin dashboard
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   └── Providers.tsx   # React Query provider
│   ├── lib/                # Utilities
│   │   ├── api-client.ts   # API client (Axios)
│   │   └── utils.ts        # Helper functions
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   └── types/              # TypeScript types
│       └── index.ts        # Type definitions
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🛠 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Query** - Data fetching & caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Environment
NEXT_PUBLIC_ENV=development
```

## 🎨 Styling

### Tailwind CSS

Custom color palette in `tailwind.config.ts`:

```ts
colors: {
  primary: { /* Blue shades */ },
  secondary: { /* Purple shades */ },
}
```

### Global Styles

`src/app/globals.css` includes:
- Tailwind directives
- CSS variables for theming
- Custom utility classes

### Component Styling

Use `cn()` utility from `lib/utils.ts`:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

## 📡 API Integration

### API Client

`lib/api-client.ts` provides a centralized Axios instance:

```tsx
import { apiClient } from "@/lib/api-client";

// Usage
const response = await apiClient.login(email, password);
const user = await apiClient.getCurrentUser();
```

### React Query

Data fetching with React Query:

```tsx
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: () => apiClient.getApplications(),
  });
}
```

## 🔐 Authentication

### JWT Token Storage

Tokens stored in cookies (secure, httpOnly in production):

```tsx
import Cookies from "js-cookie";

// Set token
Cookies.set("auth_token", token);

// Get token
const token = Cookies.get("auth_token");

// Remove token
Cookies.remove("auth_token");
```

### Protected Routes

Use middleware or client-side checks:

```tsx
// In page component
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    apiClient.getCurrentUser().catch(() => {
      router.push("/auth/login");
    });
  }, []);
}
```

## 📄 Pages

### Public Pages
- `/` - Homepage
- `/auth/login` - Login page (to be created)
- `/auth/register` - Registration page (to be created)

### Protected Pages
- `/dashboard` - User dashboard (to be created)
- `/apply` - Application wizard (to be created)
- `/admin` - Admin dashboard (to be created)

## 🧩 Components

### Component Organization

```
components/
├── layout/          # Header, Footer, Sidebar
├── ui/              # Reusable UI components (Button, Input, etc.)
├── forms/           # Form components
├── wizard/          # Application wizard steps
└── Providers.tsx    # Context providers
```

### Creating Components

```tsx
// components/ui/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export function Button({ children, variant = "primary", onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg transition-colors",
        variant === "primary" && "bg-primary-600 text-white hover:bg-primary-700",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300"
      )}
    >
      {children}
    </button>
  );
}
```

## 🔧 Utilities

### Helper Functions

`lib/utils.ts` includes:

```tsx
// Currency formatting
formatCurrency(299) // "$299.00"

// Date formatting
formatDate("2025-01-06") // "January 6, 2025"

// File utilities
validateFileSize(file, 10) // Max 10MB
validateFileType(file, ["pdf", "jpg"]) // Check extension
```

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Watch mode
npm test -- --watch
```

## 📱 Responsive Design

All components are mobile-first:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

### Netlify

1. Push to GitHub
2. Import repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy

### Custom Server

```bash
# Build
npm run build

# Start
npm start

# Or use PM2
pm2 start npm --name "tundua-frontend" -- start
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Ensure backend is running on specified port
3. Check browser console for CORS errors
4. Verify backend CORS middleware allows frontend origin

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

Proprietary - All rights reserved

---

**Built with Next.js 14 & TypeScript**
