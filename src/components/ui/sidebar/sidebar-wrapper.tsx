import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "./sidebar-context"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "./sidebar-constants"

export const SidebarWrapper = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SidebarProvider
        defaultOpen={defaultOpen}
        open={openProp}
        onOpenChange={setOpenProp}
        ref={ref}
        {...props}
      >
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarProvider>
    )
  }
)
SidebarWrapper.displayName = "SidebarWrapper" 