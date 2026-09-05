import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  description?: string;
}

export function StatCard({
  label,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-100">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-950/60 text-xl">
          {icon}
        </div>

      </div>
    </Card>
  );
}