import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type PortalRole = "admin" | "manager" | "agent" | "reception" | "client" | null;
type PortalSource = "users" | "members" | null;

export type PortalAccess = {
  role: PortalRole;
  source: PortalSource;
  status: string | null;
  isAdmin: boolean;
  isApproved: boolean;
};

const ACTIVE_STATUSES = new Set(["active", "approved"]);
const LEGACY_ADMIN_EMAIL = "riyasatinfra@2026.com";
const LEGACY_ADMIN_PASSWORD = "Riyasat&Infra@20-26";

const normalizeStatus = (status?: string | null) => (status || "").trim().toLowerCase();
const normalizeRole = (role?: string | null) => (role || "").trim().toLowerCase() as PortalRole;

const isApprovedStatus = (status?: string | null) => ACTIVE_STATUSES.has(normalizeStatus(status));

export const getPortalAccess = async (user: User): Promise<PortalAccess> => {
  const email = user.email?.trim().toLowerCase();

  if (!email) {
    return {
      role: null,
      source: null,
      status: null,
      isAdmin: false,
      isApproved: false,
    };
  }

  try {
    const { data: userRow } = await supabase
      .from("users")
      .select("*")
      .or(`id.eq.${user.id},email.eq.${email}`)
      .limit(1)
      .maybeSingle();

    if (userRow) {
      let roleCode: PortalRole = normalizeRole(userRow.role_code);

      if (!roleCode && userRow.role_id) {
        const { data: roleRow } = await supabase
          .from("roles")
          .select("code")
          .eq("id", userRow.role_id)
          .maybeSingle();

        roleCode = normalizeRole(roleRow?.code);
      }

      const status = normalizeStatus(userRow.status);
      return {
        role: roleCode,
        source: "users",
        status,
        isAdmin: roleCode === "admin" && isApprovedStatus(status),
        isApproved: isApprovedStatus(status),
      };
    }
  } catch {
    // Fall through to legacy members table lookup.
  }

  const { data: memberRow } = await supabase
    .from("members")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  const role = normalizeRole(memberRow?.role || memberRow?.requested_role);
  const status = normalizeStatus(memberRow?.status);

  return {
    role,
    source: memberRow ? "members" : null,
    status: status || null,
    isAdmin: role === "admin" && isApprovedStatus(status),
    isApproved: isApprovedStatus(status),
  };
};

export const ensureLegacyMemberAuthAccount = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  const isLegacySeedAdmin =
    normalizedEmail === LEGACY_ADMIN_EMAIL &&
    password === LEGACY_ADMIN_PASSWORD;

  const { data: memberRow, error: memberError } = await supabase
    .from("members")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (memberError) {
    const safeSchemaMismatch =
      memberError.message.includes("password") ||
      memberError.message.includes("role") ||
      memberError.message.includes("phone");

    if (!safeSchemaMismatch) {
      throw memberError;
    }
  }

  if (!memberRow && !isLegacySeedAdmin) {
    return false;
  }

  const legacyPassword =
    typeof memberRow?.password === "string" ? memberRow.password : null;

  if (!isLegacySeedAdmin && (!legacyPassword || legacyPassword !== password)) {
    return false;
  }

  const fullName =
    memberRow?.full_name ||
    (isLegacySeedAdmin ? "System Admin" : "Portal User");

  const phone =
    memberRow?.phone ||
    memberRow?.phone_e164 ||
    "+910000000000";

  const role =
    memberRow?.role ||
    memberRow?.requested_role ||
    (isLegacySeedAdmin ? "admin" : "agent");

  const { error: signUpError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role,
      },
    },
  });

  if (signUpError) {
    const message = signUpError.message.toLowerCase();
    const isExistingAccountError =
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists") ||
      message.includes("confirmed");

    if (!isExistingAccountError) {
      throw signUpError;
    }
  }

  return true;
};
