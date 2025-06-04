"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button
      variant="ghost"
      onClick={scrollToTop}
      className="flex items-center space-x-2"
    >
      <ArrowUp className="h-4 w-4" />
      <span>Back to Top</span>
    </Button>
  )
}