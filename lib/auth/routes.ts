export const AUTH_ROUTES = ["/sign-in", "/sign-up", "/verify-email"] as const;

export const PROTECTED_PAGE_ROUTES = ["/projects"] as const;

export const PROTECTED_API_ROUTES = ["/api/projects", "/api/ai"] as const;

export function isProtectedPath(pathname: string) {
  return (
    PROTECTED_PAGE_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    ) ||
    PROTECTED_API_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  );
}

export function isAuthPath(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function requiresVerifiedEmail(pathname: string) {
  return isProtectedPath(pathname);
}
