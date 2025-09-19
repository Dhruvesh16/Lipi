import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

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
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-blue-500/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-300"></div>
                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Lipi</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
              The AI-powered medical scribe that transforms patient conversations into accurate clinical notes, 
              helping physicians focus on what matters most - patient care.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4 mr-3" />
                <span className="text-sm">support@lipi.com</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
                <Phone className="w-4 h-4 mr-3" />
                <span className="text-sm">1-800-LIPI-AI</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm"></div>
              <div className="relative p-4 rounded-xl">
                <h3 className="font-bold text-white mb-4 text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Separator */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 px-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-gray-400">
            <p className="text-sm">© 2024 Lipi. All rights reserved.</p>
            <p className="text-xs mt-1 text-purple-400">HIPAA compliant medical transcription platform.</p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-blue-950/50 border border-blue-500/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-400 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            <div className="hidden md:block w-px h-6 bg-blue-500/20"></div>
            
            <div className="flex space-x-4 text-sm">
              <button 
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                onClick={() => console.log('Privacy policy clicked')}
              >
                Privacy
              </button>
              <button 
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                onClick={() => console.log('Terms clicked')}
              >
                Terms
              </button>
              <button 
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                onClick={() => console.log('Cookies policy clicked')}
              >
                Cookies
              </button>
            </div>
          </div>
        </div>

        {/* Additional Trust Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-500/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Secure & HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}