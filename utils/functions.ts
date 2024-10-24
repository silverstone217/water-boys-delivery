export const isEmptyString = (str: string) => {
  return str.replace(/ /g, "") === "";
};

export const returnRole = (role: string | undefined | null) => {
  if (!role) return "";
  switch (role) {
    case "admin":
      return "Admin";
    case "super_admin":
      return "Super Admin";
    case "delivery":
      return "Delivery";
    default:
      return "";
  }
};
