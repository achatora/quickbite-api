import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../../services/authService";

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
  });
}
