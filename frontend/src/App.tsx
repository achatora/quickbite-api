import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import { routes } from "./app/routes";
import { PageLoader } from "./components/molecules/PageLoader";

export default function App() {
  const location = useLocation();
  const element = useRoutes(routes, location);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>{element}</Suspense>
    </AnimatePresence>
  );
}
