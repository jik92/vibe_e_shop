import { Link } from '@tanstack/react-router'
import { Github, Globe, Linkedin, Twitter } from 'lucide-react'

const footerLinks = [
  {
    title: 'Products',
    links: [
      { label: 'PulseCart Commerce', href: 'https://example.com/commerce' },
      { label: 'AI Merchandising', href: 'https://example.com/ai' },
      { label: 'Realtime Orders', href: 'https://example.com/orders' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: 'https://example.com/about' },
      { label: 'Careers', href: 'https://example.com/careers' },
      { label: 'Press', href: 'https://example.com/press' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: 'https://example.com/docs' },
      { label: 'Status', href: 'https://example.com/status' },
      { label: 'Guides', href: 'https://example.com/guides' }
    ]
  }
] as const

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/example' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/example' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/example' },
  { icon: Globe, label: 'Blog', href: 'https://example.com/blog' }
] as const

const Footer = (): JSX.Element => (
  <footer className="border-t border-[#E3DCCF] bg-[#FBFAF7]">
    <div className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-12 lg:py-14">
      <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 text-[#2A2A2A]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] text-white">∞</div>
            <span className="text-lg font-semibold tracking-tight">PulseCart</span>
          </Link>
          <p className="text-sm text-[#4F4B45]">Composable commerce for multilingual AI-native storefronts.</p>
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E3DCCF] text-[#2A2A2A] transition hover:border-[#111111]"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
        {footerLinks.map((group) => (
          <div key={group.title}>
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#111111]">{group.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#4F4B45]">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-[#111111]" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-[#E3DCCF] pt-6 text-xs text-[#4F4B45] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} PulseCart. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://example.com/privacy" target="_blank" rel="noreferrer" className="hover:text-[#111111]">
            Privacy
          </a>
          <a href="https://example.com/terms" target="_blank" rel="noreferrer" className="hover:text-[#111111]">
            Terms
          </a>
          <a href="https://example.com/security" target="_blank" rel="noreferrer" className="hover:text-[#111111]">
            Security
          </a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
