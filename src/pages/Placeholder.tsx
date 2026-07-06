import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { Sparkles } from "lucide-react";

interface PlaceholderProps {
  title: string;
  subtitle: string;
  illustration: "invoices" | "weddings" | "clients" | "payments" | "calendar";
}

export default function Placeholder({ title, subtitle, illustration }: PlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="card">
        <EmptyState
          illustration={illustration}
          title={`${title} is coming soon`}
          body="This space is being crafted with the same care as the rest of your studio. Check back shortly."
          action={
            <Button variant="blush" icon={<Sparkles className="h-4 w-4" />}>
              Notify me
            </Button>
          }
        />
      </div>
    </div>
  );
}
