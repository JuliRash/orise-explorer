import Link from "next/link"

const footerLinks = {
  company: {
    title: "Company",
    links: [
      { label: "Brand Assets", href: "/brand-assets" },
      { label: "Contact Us", href: "/contact" },
      { label: "Terms & Privacy", href: "/terms" },
      { label: "Bug Bounty", href: "/bug-bounty" },
    ],
  },
  community: {
    title: "Community",
    links: [
      { label: "API Documentation", href: "/api-docs" },
      { label: "Knowledge Base", href: "/knowledge-base" },
      { label: "Network Status", href: "/network-status" },
      { label: "Learn UCC", href: "/learn" },
    ],
  },
  products: {
    title: "Product & Services",
    links: [
      { label: "Advertise", href: "/advertise" },
      { label: "Explorer as a Service", href: "/explorer-service" },
      { label: "API Plans", href: "/api-plans" },
      { label: "Priority Support", href: "/support" },
      { label: "Blockscan", href: "/blockscan" },
    ],
  },
}

export function FooterLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
      {Object.entries(footerLinks).map(([key, section]) => (
        <div key={key}>
          <h3 className="font-semibold mb-4">{section.title}</h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}