import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";

export function useSocket() {
  return useContext(SocketContext);
}