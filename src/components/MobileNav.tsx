import * as React from "react"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface NavItem {
  name: string
  href: string
}

interface MobileNavProps {
  items: NavItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-center">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col items-center space-y-4 mt-8">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
