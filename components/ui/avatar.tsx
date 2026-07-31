"use client"

import * as React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar>
>(({ className, ...props }, ref) => (
  <Avatar
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
AvatarRoot.displayName = Avatar.displayName

const AvatarImageEl = React.forwardRef<
  React.ElementRef<typeof AvatarImage>,
  React.ComponentPropsWithoutRef<typeof AvatarImage>
>(({ className, ...props }, ref) => (
  <AvatarImage
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImageEl.displayName = AvatarImage.displayName

const AvatarFallbackEl = React.forwardRef<
  React.ElementRef<typeof AvatarFallback>,
  React.ComponentPropsWithoutRef<typeof AvatarFallback>
>(({ className, ...props }, ref) => (
  <AvatarFallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallbackEl.displayName = AvatarFallback.displayName

export { AvatarRoot as Avatar, AvatarImageEl as AvatarImage, AvatarFallbackEl as AvatarFallback }
