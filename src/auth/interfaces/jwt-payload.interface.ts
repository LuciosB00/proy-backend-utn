import { Role } from "@generated";

export interface JwtPayload {
  id: string;
  role: Role;
}
