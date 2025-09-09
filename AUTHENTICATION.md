# CSCORE Frontend Authentication System

This document describes the authentication and authorization system implemented in the CSCORE frontend application.

## Features Implemented

### 1. Authentication System
- **Login/Logout**: Complete authentication flow with JWT tokens
- **Role-based Access Control**: Support for ADMIN, TEACHER, and STUDENT roles
- **Protected Routes**: Automatic redirection based on authentication status and roles
- **Token Management**: JWT token storage and automatic inclusion in API requests

### 2. Backend Integration
- **API Client**: Centralized HTTP client with automatic token handling
- **Services**: Dedicated services for Auth, User, Course, and Dashboard operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Health Check**: Backend connectivity status monitoring

### 3. User Interface Components
- **Responsive Navigation**: Dynamic navigation based on user roles
- **Dashboard Pages**: Role-specific dashboards for Admin, Teacher, and Student
- **User Management**: Complete CRUD operations for user management (Admin only)
- **Loading States**: Proper loading indicators throughout the application

## File Structure

```
├── contexts/
│   └── AuthContext.tsx          # React Context for authentication state
├── hooks/
│   └── useRoleAccess.ts         # Custom hook for role-based access control
├── components/
│   ├── hoc/
│   │   └── withAuth.tsx         # Higher-order component for route protection
│   ├── admin/
│   │   └── UserManagement.tsx   # Admin user management interface
│   └── common/
│       ├── BackendStatus.tsx    # Backend connectivity status
│       └── Navbar.tsx           # Updated navigation with auth
├── services/
│   ├── auth.service.ts          # Authentication API calls
│   ├── user.service.ts          # User management API calls
│   ├── course.service.ts        # Course management API calls
│   ├── dashboard.service.ts     # Dashboard data API calls
│   └── health.service.ts        # Backend health check
├── lib/
│   └── api-client.ts            # HTTP client with JWT integration
├── types/
│   ├── auth.ts                  # Authentication type definitions
│   └── api.ts                   # API response type definitions
└── src/app/
    ├── login/                   # Login page
    ├── admin/                   # Admin pages
    ├── teacher/                 # Teacher pages
    ├── student/                 # Student pages (updated)
    └── unauthorized/            # Unauthorized access page
```

## Getting Started

### 1. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. Start the Backend
Navigate to the backend directory and start the Spring Boot application:
```bash
cd cscore-backend
mvn spring-boot:run
# or
./mvnw spring-boot:run
```

### 3. Start the Frontend
```bash
npm run dev
```

## Usage Examples

### 1. Authentication
```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginComponent() {
  const { signIn, state } = useAuth();
  
  const handleLogin = async () => {
    try {
      await signIn(username, password);
      // User will be automatically redirected based on their role
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

### 2. Role-based Access Control
```tsx
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Role } from '@/types/auth';

function MyComponent() {
  const { canAccessAdmin, isTeacher, getRoleName } = useRoleAccess();
  
  return (
    <div>
      {canAccessAdmin() && <AdminButton />}
      {isTeacher() && <TeacherSection />}
      <p>Current role: {getRoleName()}</p>
    </div>
  );
}
```

### 3. Protected Routes
```tsx
import { withAuth } from '@/components/hoc/withAuth';
import { Role } from '@/types/auth';

function AdminPage() {
  return <div>Admin only content</div>;
}

export default withAuth(AdminPage, {
  requiredRoles: [Role.ADMIN],
});
```

### 4. API Service Usage
```tsx
import { UserService } from '@/services/user.service';

// Get all users (Admin only)
const users = await UserService.getAllUsers();

// Create a new user
await UserService.createUser({
  username: 'student01',
  email: 'student01@example.com',
  password: 'password123',
  fullName: 'Student Name',
  role: Role.STUDENT,
});

// Search users
const searchResults = await UserService.searchUsers('john');
```

## Default User Accounts

For testing purposes, you can create these default accounts using the API:

### Admin Account
```json
{
  "username": "admin",
  "email": "admin@cscore.com",
  "password": "admin123",
  "fullName": "Administrator",
  "role": "ADMIN"
}
```

### Teacher Account
```json
{
  "username": "teacher01",
  "email": "teacher01@iuh.edu.vn",
  "password": "teacher123",
  "fullName": "Nguyễn Thị B",
  "role": "TEACHER"
}
```

### Student Account
```json
{
  "username": "student01",
  "email": "student01@student.iuh.edu.vn",
  "password": "student123",
  "fullName": "Trần Văn C",
  "studentId": "21001234",
  "role": "STUDENT"
}
```

## API Endpoints

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/signin` - User login

### Admin APIs
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `PATCH /api/admin/users/{id}/toggle-status` - Toggle user status

### Teacher APIs
- `GET /api/teacher/dashboard` - Teacher dashboard data
- `GET /api/teacher/courses` - Get teacher courses

### Student APIs
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/courses/enrolled` - Get enrolled courses

## Security Features

1. **JWT Token Management**: Automatic token storage and inclusion in requests
2. **Route Protection**: Automatic redirection for unauthorized access
3. **Role-based UI**: UI elements shown/hidden based on user roles
4. **Error Handling**: Proper error messages for authentication failures
5. **Auto-logout**: Token expiration handling (can be extended)

## Troubleshooting

### Backend Connection Issues
- Check if the backend is running on port 8080
- Verify the `NEXT_PUBLIC_API_BASE_URL` environment variable
- Check the backend status indicator on the home page

### Authentication Issues
- Clear localStorage and try again
- Check browser console for API errors
- Verify user credentials with backend logs

### Permission Issues
- Verify user role in the backend database
- Check if the user account is active
- Ensure proper role-based route configuration

## Future Enhancements

1. **Refresh Token**: Implement automatic token refresh
2. **Password Reset**: Add forgot password functionality
3. **Profile Management**: User profile editing
4. **Session Management**: Better session handling
5. **Audit Logs**: Track user activities
6. **2FA**: Two-factor authentication support
