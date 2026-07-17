import { HTMLAttributes } from "react"

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-warm-800/50 ${className}`}
      {...props}
    />
  )
}

export { Skeleton }
