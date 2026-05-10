import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={['SEEKER']}>{children}</ProtectedRoute>;
}
