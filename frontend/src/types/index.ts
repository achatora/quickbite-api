export interface ApiErrorResponse {
  success: false;
  message: string;
  code: number;
}

export interface ApiSuccessResponse<TData = unknown> {
  success: true;
  message: string;
  code: number;
  data?: TData;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
}

export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "ready for pickup",
  "completed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: number;
  menu_id: number;
  user_id: number;
  item_name: string;
  quantity: number;
  notes: string;
  total_price: number;
  status: OrderStatus;
}

export interface CreateOrderInput {
  menu_id: number;
  quantity: number;
  notes: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface CreateMenuItemInput {
  name: string;
  description: string;
  price: number;
}

export interface UpdateMenuAvailabilityInput {
  is_available: boolean;
}

export type UserRole = "admin" | "customer";

export interface SessionUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
}

export interface LoginUserResponse extends SessionUser {
  password: string;
}

export type ProfileResponseData = SessionUser;

export interface RegisterInput {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginData {
  user: LoginUserResponse;
  token: string;
}

export interface JwtPayload {
  user_id: number;
  exp: number;
  iat: number;
}

export type MenuResponse = MenuItem[];
export type OrdersResponse = Order[];
export type MenuApiResponse = ApiSuccessResponse<MenuResponse>;
export type MenuItemApiResponse = ApiSuccessResponse<MenuItem>;
export type OrdersApiResponse = ApiSuccessResponse<OrdersResponse>;
export type OrderApiResponse = ApiSuccessResponse<Order>;
export type MessageApiResponse = ApiSuccessResponse<never>;
export type RegistrationApiResponse = ApiSuccessResponse<LoginUserResponse>;
export type LoginApiResponse = ApiSuccessResponse<LoginData>;
export type ProfileApiResponse = ApiSuccessResponse<ProfileResponseData>;

export interface CartItem {
  cart_id: string;
  menu_item: MenuItem;
  quantity: number;
  notes: string;
}

export interface CheckoutFormValues {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfillment_method: "pickup";
  order_notes: string;
}

export interface CheckoutResult {
  orders: Order[];
  customer: CheckoutFormValues;
}
