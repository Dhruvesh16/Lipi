import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "How it Works", href: "#how-it-works" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#integrations" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api" },
        { name: "Support", href: "#support" },
        { name: "Status", href: "#status" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
        { name: "Blog", href: "#blog" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "HIPAA Compliance", href: "#hipaa" },
        { name: "Security", href: "#security" }
      ]
    }
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold">Lipi</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              The AI-powered medical scribe that transforms patient conversations into accurate clinical notes, 
              helping physicians focus on what matters most - patient care.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3" data-testid={`text-footer-section-${section.title.toLowerCase()}`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`link-footer-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Lipi. All rights reserved. HIPAA compliant medical transcription platform.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <button 
              className="hover:text-foreground transition-colors"
              data-testid="link-privacy"
              onClick={() => console.log('Privacy policy clicked')}
            >
              Privacy
            </button>
            <button 
              className="hover:text-foreground transition-colors"
              data-testid="link-terms"
              onClick={() => console.log('Terms clicked')}
            >
              Terms
            </button>
            <button 
              className="hover:text-foreground transition-colors"
              data-testid="link-cookies"
              onClick={() => console.log('Cookies policy clicked')}
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}