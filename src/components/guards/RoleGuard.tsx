import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useAuthStore();

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to home if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;