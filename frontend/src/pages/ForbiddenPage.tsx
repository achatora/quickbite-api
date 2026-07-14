import { Link } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { PageShell } from "../components/layouts/PageShell";
import { EmptyState } from "../components/molecules/EmptyState";

export function ForbiddenPage() {
  return (
    <PageShell className="max-w-4xl">
      <EmptyState
        title="You do not have access to this area"
        description="This section requires admin permissions in the current backend."
        action={<Button as={Link} to="/account">Back to account</Button>}
      />
    </PageShell>
  );
}
