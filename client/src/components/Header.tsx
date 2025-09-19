import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" }
  ];

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/10' 
          : 'bg-slate-900/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Animated Logo */}
        <a href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-300"></div>
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-white font-bold text-xl">L</span>
            </div>
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Lipi
          </span>
        </a>

        {/* Desktop Navigation with Hover Effects */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="relative group text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-purple-950/30"
            >
              <span className="relative z-10 font-medium">{item.name}</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></div>
            </a>
          ))}
        </nav>

        {/* Actions with Enhanced Styling */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-blue-950/50 transition-all duration-300 px-6 py-2"
              >
                Log in
              </Button>
            </a>
            <a href="/signup">
              <Button 
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Button>
            </a>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white hover:bg-purple-950/50 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu 
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                }`} 
              />
              <X 
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                }`} 
              />
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-blue-500/20">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`block py-3 px-4 rounded-lg text-gray-300 hover:text-white hover:bg-blue-950/50 transition-all duration-300 transform ${
                  isMobileMenuOpen 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-4 opacity-0'
                }`}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="flex flex-col space-y-3 pt-4 border-t border-blue-500/20">
              <a href="/login">
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-300 hover:text-white hover:bg-blue-950/50 transition-all duration-300"
                >
                  Log in
                </Button>
              </a>
              <a href="/signup">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </a>
            </div>
          </nav>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
        `
      }} />
    </header>
  );
}