// src/utils/roleUtils.js
export const getDashboardPath = (user) => {
  if (!user) return "/login";

  switch (user.role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "IT_ADMIN":
      return "/dashboard/it-admin";
    case "OPERATOR":
      return "/dashboard/operator";
    case "QA":
      return "/dashboard/qa";
    case "LAB_TECHNICIAN":
      return "/dashboard/lab-technician";
    default:
      return "/dashboard";
  }
};

export const getRoleDisplayName = (role) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "IT_ADMIN":
      return "IT Administrator";
    case "OPERATOR":
      return "Operator";
    case "QA":
      return "Quality Analyst";
    case "LAB_TECHNICIAN":
      return "Lab Technician";
    default:
      return role || "Unknown Role";
  }
};
