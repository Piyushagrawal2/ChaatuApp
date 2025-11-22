"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
    icon: LucideIcon
    label: string
    isActive?: boolean
    onClick?: () => void
    children?: React.ReactNode // Content for the flyout
}

export function SidebarItem({ icon: Icon, label, isActive, onClick, children }: SidebarItemProps) {
    return (
        <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-12 w-12 rounded-xl transition-colors duration-200",
                        isActive
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={onClick}
                >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="sr-only">{label}</span>
                </Button>
            </HoverCardTrigger>
            {children && (
                <HoverCardContent
                    side="right"
                    align="start"
                    sideOffset={10}
                    className="w-80 p-0 overflow-hidden border-none shadow-xl bg-background/95 backdrop-blur-sm"
                >
                    {children}
                </HoverCardContent>
            )}
        </HoverCard>
    )
}

