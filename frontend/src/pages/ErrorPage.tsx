import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { StateMessage } from "../components/molecules/StateMessage";

export function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Unexpected route error.";

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-xl rounded-[2rem]">
        <StateMessage tone="error">{message}</StateMessage>
      </div>
    </main>
  );
}
