// permissions.js — Role and permission utilities for RBAC

export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
    VOLUNTEER: "VOLUNTEER",
};

// Features that can be permission-checked
export const FEATURES = {
    VIEW_EVENTS: "VIEW_EVENTS",
    DONATE: "DONATE",
    APPLY_VOLUNTEER: "APPLY_VOLUNTEER",
    CREATE_EVENT: "CREATE_EVENT",
    APPROVE_VOLUNTEER: "APPROVE_VOLUNTEER",
    VIEW_ALL_DONATIONS: "VIEW_ALL_DONATIONS",
    VIEW_DASHBOARD: "VIEW_DASHBOARD",
    MANAGE_USERS: "MANAGE_USERS",
};

// Permission matrix — which roles can access which features
const PERMISSION_MAP = {
    [FEATURES.VIEW_EVENTS]: [ROLES.ADMIN, ROLES.USER, ROLES.VOLUNTEER],
    [FEATURES.DONATE]: [ROLES.ADMIN, ROLES.USER, ROLES.VOLUNTEER],
    [FEATURES.APPLY_VOLUNTEER]: [ROLES.USER, ROLES.VOLUNTEER],
    [FEATURES.CREATE_EVENT]: [ROLES.ADMIN],
    [FEATURES.APPROVE_VOLUNTEER]: [ROLES.ADMIN],
    [FEATURES.VIEW_ALL_DONATIONS]: [ROLES.ADMIN],
    [FEATURES.VIEW_DASHBOARD]: [ROLES.ADMIN],
    [FEATURES.MANAGE_USERS]: [ROLES.ADMIN],
};

/**
 * Check if a user role has permission for a specific feature
 */
export const hasPermission = (userRole, feature) => {
    const allowedRoles = PERMISSION_MAP[feature];
    if (!allowedRoles) return false;
    return allowedRoles.includes(userRole);
};

/**
 * Check if a user role is in the list of allowed roles
 */
export const canAccess = (userRole, allowedRoles) => {
    if (!userRole || !allowedRoles) return false;
    return allowedRoles.includes(userRole);
};

/**
 * Get role display label
 */
export const getRoleLabel = (role) => {
    switch (role) {
        case ROLES.ADMIN:
            return "Admin";
        case ROLES.VOLUNTEER:
            return "Volunteer";
        case ROLES.USER:
            return "Member";
        default:
            return "Guest";
    }
};

/**
 * Get role badge color class (Tailwind)
 */
export const getRoleBadgeClass = (role) => {
    switch (role) {
        case ROLES.ADMIN:
            return "bg-red-100 text-red-800";
        case ROLES.VOLUNTEER:
            return "bg-green-100 text-green-800";
        case ROLES.USER:
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
