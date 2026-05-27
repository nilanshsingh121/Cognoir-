# 📁 Project Structure Guide

```
cognoir/
├── 📂 src/                          # Source code
│   ├── 📂 components/               # React components
│   │   ├── HomePage.tsx             # Dashboard/home page
│   │   ├── LoginPage.tsx            # Login form (Context-based)
│   │   ├── SignupPage.tsx           # Signup form (Context-based)
│   │   ├── Login.tsx                # Login form (Store-based)
│   │   ├── Register.tsx             # Register form (Store-based)
│   │   └── index.ts                 # Component exports
│   │
│   ├── 📂 contexts/                 # React Context providers
│   │   ├── AuthContext.tsx          # Authentication context
│   │   └── index.ts                 # Context exports
│   │
│   ├── 📂 stores/                   # State management stores
│   │   ├── authStore.ts             # Alternative auth store (Zustand-style)
│   │   └── index.ts                 # Store exports
│   │
│   ├── 📂 types/                    # TypeScript type definitions
│   │   ├── auth.types.ts            # Authentication types
│   │   └── index.ts                 # Type exports
│   │
│   ├── App.tsx                      # Main app component (Context-based)
│   ├── App_Updated.tsx              # Alternative app (Store-based)
│   ├── main.tsx                     # Entry point with AuthProvider
│   └── index.css                    # Global styles
│
├── 📂 docs/                         # Documentation
│   ├── README.md                    # Documentation index
│   ├── QUICK_SETUP.md               # 3-step quick start
│   ├── QUICK_REFERENCE.md           # Visual quick reference
│   ├── IMPLEMENTATION_GUIDE.md       # Complete setup guide
│   ├── CODE_REVIEW.md               # Code quality analysis
│   ├── DETAILED_REVIEW.md           # Detailed review
│   ├── ARCHITECTURE_DIAGRAM.md       # System architecture
│   └── LOGIN_IMPLEMENTATION_GUIDE.md # Login specific guide
│
├── 📂 public/                       # Static assets
│   ├── favicon.ico
│   └── vite.svg
│
├── 📂 .github/                      # GitHub configuration
│   └── 📂 workflows/                # CI/CD workflows
│       └── build-deploy.yml         # Build & deploy automation
│
├── 📄 README.md                     # Main README
├── 📄 README-GITHUB.md              # GitHub repository README
├── 📄 CONTRIBUTING.md               # Contribution guidelines
├── 📄 LICENSE                       # MIT License
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .env.example                  # Environment variables template
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 tsconfig.node.json            # Node TypeScript config
├── 📄 vite.config.ts                # Vite configuration
├── 📄 .eslintrc.cjs                 # ESLint configuration
├── 📄 .prettierrc                   # Prettier configuration
└── 📄 PROJECT_INFO.md               # Project metadata
```

## 📝 File Descriptions

### Core Application Files

#### `src/App.tsx`
- Main application component
- Handles authentication routing
- Conditional rendering based on auth state
- **Uses**: React Context API for auth

#### `src/App_Updated.tsx`
- Alternative app component
- **Uses**: Store-based authentication
- Same functionality, different state management

#### `src/main.tsx`
- Entry point for the React application
- Wraps App with AuthProvider
- Renders to #root element

### Components (`src/components/`)

#### `HomePage.tsx`
- Dashboard showing user's notebooks
- Create/edit/delete notebooks
- Shows user profile & logout button
- Only visible when authenticated

#### `LoginPage.tsx`
- Beautiful login form
- Email & password fields
- Password visibility toggle
- Demo account quick-login
- Uses React Context for auth
- **Default approach**

#### `SignupPage.tsx`
- User registration form
- Name, email, password fields
- Password strength indicator
- Form validation
- Success animation
- Uses React Context for auth

#### `Login.tsx`
- Alternative login component
- More minimal design
- Uses Store-based auth
- Compatible with alternative App

#### `Register.tsx`
- Alternative registration component
- Store-based authentication
- Similar to SignupPage but different styling

### Authentication (`src/contexts/` & `src/stores/`)

#### `AuthContext.tsx`
- React Context for authentication
- Provides: login, signup, logout, user state
- **Recommended approach for this project**
- Local storage for persistence
- Error handling included

#### `authStore.ts`
- Alternative store implementation
- Zustand-style hook
- Same functionality as Context
- Can be used with App_Updated.tsx

### Types (`src/types/`)

#### `auth.types.ts`
- User interface definition
- AuthContextType definition
- Type-safe authentication

## 🗂️ File Organization

### By Feature
```
Authentication:
  ├── src/contexts/AuthContext.tsx
  ├── src/stores/authStore.ts
  ├── src/types/auth.types.ts
  ├── src/components/LoginPage.tsx
  ├── src/components/SignupPage.tsx
  └── src/App.tsx

Components:
  ├── src/components/HomePage.tsx
  ├── src/components/Login.tsx
  └── src/components/Register.tsx
```

### By Import Path
```
Components:
  import { HomePage, LoginPage } from '@/components';

Contexts:
  import { useAuth } from '@/contexts';

Stores:
  import { useAuthStore } from '@/stores';

Types:
  import type { User } from '@/types';
```

## 📚 Documentation Files

All documentation in `docs/` folder:

| File | Purpose |
|------|---------|
| `README.md` | Documentation index |
| `QUICK_SETUP.md` | 3-step quick start guide |
| `QUICK_REFERENCE.md` | Visual quick reference |
| `IMPLEMENTATION_GUIDE.md` | Complete setup instructions |
| `CODE_REVIEW.md` | Code quality & security review |
| `DETAILED_REVIEW.md` | Detailed code analysis |
| `ARCHITECTURE_DIAGRAM.md` | System architecture |
| `LOGIN_IMPLEMENTATION_GUIDE.md` | Login-specific guide |

## 🔧 Configuration Files

### Package Management
- `package.json` - Dependencies & scripts
- `package-lock.json` - Exact dependency versions

### TypeScript
- `tsconfig.json` - Main config
- `tsconfig.node.json` - Node config (Vite)

### Build Tools
- `vite.config.ts` - Vite bundler config
- `.eslintrc.cjs` - Linting rules
- `.prettierrc` - Code formatting

### Environment
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules

### GitHub
- `.github/workflows/build-deploy.yml` - CI/CD pipeline

## 🎯 Key Features by File

### Authentication Flow
```
main.tsx (entry)
  └─> AuthProvider
       └─> App.tsx
            ├─> [Not Auth] LoginPage/SignupPage
            └─> [Authenticated] HomePage/NotebookView
```

### State Management
```
Option 1: React Context (Recommended)
  └─> AuthContext.tsx + useAuth() hook

Option 2: Store
  └─> authStore.ts + useAuthStore() hook
```

### Component Hierarchy
```
App.tsx
├── LoginPage.tsx (if not authenticated)
├── SignupPage.tsx (if not authenticated)
├── HomePage.tsx (if authenticated)
└── NotebookView.tsx (if notebook selected)
```

## 📦 Dependencies Location

### In `package.json`
- React (UI framework)
- React DOM (rendering)
- Lucide React (icons)
- UUID (unique IDs)
- TypeScript (type checking)
- Vite (build tool)
- Tailwind CSS (styling)

## 🚀 Import Examples

### Recommended Imports (Using Barrel Exports)
```typescript
// Components
import { HomePage, LoginPage } from '@/components';

// Contexts
import { useAuth } from '@/contexts';

// Stores
import { useAuthStore } from '@/stores';

// Types
import type { User, AuthContextType } from '@/types';
```

### Direct Imports (Alternative)
```typescript
// Components
import HomePage from '@/components/HomePage';

// Contexts
import { useAuth } from '@/contexts/AuthContext';

// Types
import type { User } from '@/types/auth.types';
```

## 🔍 Finding Things

### "Where's the login form?"
→ `src/components/LoginPage.tsx`

### "Where's the auth logic?"
→ `src/contexts/AuthContext.tsx`

### "How do I use auth?"
→ `const { user, login, logout } = useAuth();`

### "Where's the documentation?"
→ `docs/` folder

### "How do I get started?"
→ `docs/QUICK_SETUP.md`

### "What about security?"
→ `docs/CODE_REVIEW.md`

## 📊 Code Statistics

- **Total Components**: 5+ (HomePage, LoginPage, SignupPage, Login, Register)
- **Total Lines of Code**: 3000+
- **Documentation Files**: 8
- **Configuration Files**: 8
- **TypeScript Coverage**: 100%

## 🎨 Styling

### Tailwind CSS Classes
- Utility-first CSS framework
- Configured in `vite.config.ts`
- Custom animations in global styles
- Responsive design (mobile-first)

### Design System
- Gold color scheme (#D4AF61)
- Dark background (#070709)
- Glass morphism effects
- Smooth animations

## 🔄 File Dependencies

```
main.tsx
  ├─> AuthProvider (from AuthContext.tsx)
  └─> App.tsx
       ├─> LoginPage.tsx
       │   └─> useAuth (from AuthContext.tsx)
       ├─> SignupPage.tsx
       │   └─> useAuth (from AuthContext.tsx)
       └─> HomePage.tsx
           └─> useAuth (from AuthContext.tsx)
```

---

**Quick Navigation:**
- 📖 Setup? → `docs/QUICK_SETUP.md`
- 🔐 Security? → `docs/CODE_REVIEW.md`
- 🏗️ Architecture? → `docs/ARCHITECTURE_DIAGRAM.md`
- 📝 Code? → `src/`
