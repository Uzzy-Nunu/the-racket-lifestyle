export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // This layout is intentionally a server component. Admin access is enforced
  // at edge/server level via middleware.ts which checks the signed rkl_token.
  // Keeping this server-only avoids client reference manifest issues during build.
  return <>{children}</>;
}
