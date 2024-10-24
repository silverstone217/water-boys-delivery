export type roleUserType =
  | "user"
  | "admin"
  | "super_admin"
  | "delivery"
  | "other";
export type User = {
  id: string;
  email: string | null;
  name: string | null;
  token?: string | null;
  role: roleUserType;
  tel: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
