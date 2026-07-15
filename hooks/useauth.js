import { useContext } from "react";
import { AuthContext } from "../Context/Authcontext";

export function useAuth() {
  return useContext(AuthContext);
}