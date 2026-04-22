const ADMIN_SESSION_KEY = "riyasat_admin_session_v1";

export const LEGACY_ADMIN_EMAIL = "riyasatinfra@2026.com";
export const LEGACY_ADMIN_PASSWORD = "Riyasat&Infra@20-26";

export const isLegacyAdminCredential = (email: string, password: string) =>
  email.trim().toLowerCase() === LEGACY_ADMIN_EMAIL &&
  password.trim() === LEGACY_ADMIN_PASSWORD;

export const startLocalAdminSession = () => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "active");
};

export const hasLocalAdminSession = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "active";

export const clearLocalAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
