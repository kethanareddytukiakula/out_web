# Cleanup Required - Duplicate Old Files

The following files are **old duplicate versions** from earlier development phases and should be **deleted**:

## Files to Delete

### 1. src/pages/Login.tsx

- **Status**: OLD - Superseded by LoginPage.tsx
- **Reason**: This is v1 of login with embedded form using onSwitch callback pattern
- **Replaced by**: src/pages/LoginPage.tsx (full-screen login page)
- **Action**: DELETE THIS FILE

### 2. src/pages/Signup.tsx

- **Status**: OLD - Superseded by SignupPage.tsx
- **Reason**: This is v1 of signup with embedded form using onSwitch callback pattern
- **Replaced by**: src/pages/SignupPage.tsx (full-screen signup page with form)
- **Action**: DELETE THIS FILE

### 3. src/app/App_backup.tsx

- **Status**: BACKUP - Not used in application
- **Reason**: Backup copy from incomplete refactor with wrong imports and orphaned code
- **Action**: DELETE THIS FILE

## Current Application Structure

✅ **Active Authentication Files**:

- src/firebase/firebase.ts - Firebase config
- src/services/authService.ts - Firebase Auth wrapper
- src/services/userService.ts - Firestore user CRUD
- src/context/AuthContext.tsx - Auth state management
- src/pages/LoginPage.tsx - Production login page
- src/pages/SignupPage.tsx - Production signup page
- src/components/ProtectedRoute.tsx - Route protection
- src/app/App.tsx - Routing only (FIXED)
- src/components/AppLayout.tsx - Main authenticated UI (FIXED)

✅ **All Import Fixes Completed**:

- react-router imports → react-router-dom ✓
- Type compatibility issues → RESOLVED ✓

## How to Delete

Use VS Code's Explorer or terminal:

```bash
# Option 1: VS Code Explorer
# Right-click file → Delete

# Option 2: Terminal
rm src/pages/Login.tsx
rm src/pages/Signup.tsx
rm src/app/App_backup.tsx
```

## Status

- ✅ Phase 1: Fixed all react-router imports (5 files)
- ✅ Phase 2: Removed orphaned code from App.tsx
- ✅ Phase 3: Cleaned up type compatibility issues
- ⏳ Phase 4: Delete old files (requires manual action)
- ⏳ Phase 5: Test application and routes
