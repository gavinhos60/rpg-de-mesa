import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageHeader({
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#6B4423] pb-5">
            <div>
                <h1
                    className="text-2xl sm:text-3xl text-[#2A1D14]"
                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                >
                    {title}
                </h1>

                {description && (
                    <p className="mt-1.5 text-sm sm:text-base text-[#5C4A38]">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="flex items-center gap-3">{action}</div>}
        </div>
    );
}