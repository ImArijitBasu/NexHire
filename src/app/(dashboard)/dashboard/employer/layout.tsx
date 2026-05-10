import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={['EMPLOYER']}>{children}</ProtectedRoute>;
}
