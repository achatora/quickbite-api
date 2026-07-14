import { apiClient } from "./apiClient";
import type {
  LoginApiResponse,
  LoginInput,
  RegisterInput,
  RegistrationApiResponse,
} from "../types";

export async function registerUser(input: RegisterInput) {
  const response = await apiClient.post<RegistrationApiResponse>("/register", input);
  return response.data.data as NonNullable<RegistrationApiResponse["data"]>;
}

export async function loginUser(input: LoginInput) {
  const response = await apiClient.post<LoginApiResponse>("/login", input);
  return response.data.data as NonNullable<LoginApiResponse["data"]>;
}
