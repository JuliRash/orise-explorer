"use client"

import Link from "next/link"
import { Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FooterLinks } from "./footer-links"
import { ScrollToTop } from "./scroll-to-top"

export function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Social and Back to Top */}
        <div className="flex justify-between items-center mb-12">
          <Link href="https://twitter.com/UniverseChain" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <Twitter className="h-5 w-5" />
            <span>(Twitter/X)</span>
          </Link>
          <ScrollToTop />
        </div>

        <div className="min-h-[1px] bg-[#D9D9D9] mb-12"></div>

        {/* Main Footer Content */}
        <div className="flex w-full md:flex-row flex-col gap-6 mb-12">
          <div className="w-full md:w-[40%] ">
            <h2 className="text-xl font-medium mb-2">Powered by Universe Chain</h2>
           
          </div>
          {/* Footer Links Grid */}
          <div className="md:w-[60%] w-full">
            <FooterLinks />
          </div>
        </div>

        <div className="min-h-[1px] bg-[#D9D9D9] w-full"></div>
      </div>
    </footer>
  )
}