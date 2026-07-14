import { Link } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { PageShell } from "../components/layouts/PageShell";
import { EmptyState } from "../components/molecules/EmptyState";

export function NotFoundPage() {
  return (
    <PageShell className="max-w-4xl">
      <EmptyState
        title="That page isn't on the menu"
        description="The route you tried to open is outside the current frontend, but the rest of the ordering experience is still available."
        action={<Button as={Link} to="/menu">Go to menu</Button>}
      />
    </PageShell>
  );
}
