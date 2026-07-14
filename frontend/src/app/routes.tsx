import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layouts/AppLayout";
import { ErrorPage } from "../pages/ErrorPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { PublicOnlyRoute } from "../features/auth/PublicOnlyRoute";

const HomePage = lazy(() =>
  import("../pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const MenuPage = lazy(() =>
  import("../features/menu/MenuPage").then((module) => ({
    default: module.MenuPage,
  })),
);
const ProductDetailsPage = lazy(() =>
  import("../features/menu/ProductDetailsPage").then((module) => ({
    default: module.ProductDetailsPage,
  })),
);
const CartPage = lazy(() =>
  import("../features/cart/CartPage").then((module) => ({
    default: module.CartPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("../features/checkout/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  })),
);
const ConfirmationPage = lazy(() =>
  import("../features/checkout/ConfirmationPage").then((module) => ({
    default: module.ConfirmationPage,
  })),
);
const OrderStatusPage = lazy(() =>
  import("../features/orders/OrderStatusPage").then((module) => ({
    default: module.OrderStatusPage,
  })),
);
const AuthPage = lazy(() =>
  import("../features/auth/AuthPage").then((module) => ({
    default: module.AuthPage,
  })),
);
const AccountPage = lazy(() =>
  import("../features/account/AccountPage").then((module) => ({
    default: module.AccountPage,
  })),
);
const AdminPage = lazy(() =>
  import("../features/admin/AdminPage").then((module) => ({
    default: module.AdminPage,
  })),
);
const OrderHistoryPage = lazy(() =>
  import("../features/orders/OrderHistoryPage").then((module) => ({
    default: module.OrderHistoryPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "menu/:menuItemId", element: <ProductDetailsPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "confirmation", element: <ConfirmationPage /> },
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "login", element: <AuthPage /> },
          { path: "register", element: <AuthPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "account", element: <AccountPage /> },
          { path: "account/orders", element: <OrderHistoryPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "orders/:orderId", element: <OrderStatusPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "admin", element: <AdminPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
