import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-headline uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-forest dark:bg-secondary text-white dark:text-secondary-foreground hover:bg-forest-deep dark:hover:bg-lime-dim",
        secondary: "border-transparent bg-lime dark:bg-secondary text-forest dark:text-secondary-foreground hover:bg-lime-dim dark:hover:bg-lime-dim",
        outline: "text-foreground border-forest dark:border-secondary",
        muted: "border-transparent bg-clay dark:bg-muted text-foreground hover:bg-clay/80 dark:hover:bg-muted/80",
        destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
