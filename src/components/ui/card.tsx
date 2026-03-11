import { cn } from "@/libs/utils";

interface CardProps {
  content: React.ReactNode;
  className?: string;
}

export default function Card({ content, className }: CardProps) {
  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-2xl sm:rounded-3xl",
        className
      )}
    >
      <div className="absolute inset-0">{content}</div>
    </div>
  );
}
