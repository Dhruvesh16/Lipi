import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { useEffect, useRef } from "react";
import soundwaveImage from "@assets/generated_images/Medical_AI_soundwave_animation_3ab45fc1.png";

export default function Hero() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Update floating elements based on mouse position
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.02 * (index + 1);
        const deltaY = (e.clientY - centerY) * 0.02 * (index + 1);
        
        (el as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleWatchDemo = () => {
    console.log('Watch demo clicked');
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen flex items-center pt-20"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-element absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-${i % 3} ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center space-y-12">
          {/* Badge with Animation */}
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-950/50 backdrop-blur-sm px-6 py-2 text-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-blue-400 mr-2 animate-spin-slow" />
            <span className="text-blue-300">Trusted by over</span>
            <span className="ml-1 font-semibold text-white">50,000+ physicians</span>
          </div>

          {/* Main Heading with Gradient Animation */}
          <div className="space-y-8 animate-fade-in-up animation-delay-200">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
              <span className="block text-white mb-4">The Future of</span>
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent animate-gradient-x">
                Medical Documentation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              AI-powered medical scribe that transforms conversations into clinical notes instantly. 
              <span className="text-blue-400 font-semibold"> Focus on patients, not paperwork.</span>
            </p>
          </div>

          {/* Interactive Soundwave */}
          <div className="flex justify-center py-12 animate-fade-in-up animation-delay-400">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-30 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
              <div className="relative bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
                <img 
                  src={soundwaveImage} 
                  alt="AI Medical Scribe Soundwave"
                  className="w-full max-w-2xl h-auto opacity-90 hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 animate-pulse-slow rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons with Hover Effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-up animation-delay-600">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 text-lg"
            >
              <span className="relative z-10 flex items-center">
                Get Started Free
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-sm"></div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleWatchDemo}
              className="group px-12 py-4 border-2 border-blue-500/40 text-blue-300 hover:bg-blue-950/50 hover:border-blue-400 hover:text-white rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm text-lg font-semibold"
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Stats with Counter Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 animate-fade-in-up animation-delay-800">
            {[
              { value: "2", unit: "hours", desc: "saved daily on documentation", icon: Zap },
              { value: "40", unit: "%", desc: "faster clinical workflows", icon: ArrowRight },
              { value: "99", unit: "%", desc: "transcription accuracy", icon: Shield }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                <div className="relative space-y-4 p-8 rounded-xl bg-black/30 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
                  <stat.icon className="w-10 h-10 text-blue-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-5xl font-bold text-white">
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <span className="text-blue-300 ml-2">{stat.unit}</span>
                  </div>
                  <div className="text-gray-400 font-medium">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Large Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/30 to-blue-600/30 rounded-full blur-3xl animate-float-slow animation-delay-1000"></div>
        
        {/* Animated Rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[800px] h-[800px] border border-blue-500/10 rounded-full animate-spin-very-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-indigo-500/10 rounded-full animate-spin-reverse-slow"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          
          @keyframes float-0 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(120deg); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(240deg); }
          }
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes spin-very-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse-slow {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          
          .animate-grid-move {
            animation: grid-move 20s linear infinite;
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
          }
          .animate-gradient-x {
            animation: gradient-x 4s ease infinite;
            background-size: 200% 200%;
          }
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }
          .animate-spin-very-slow {
            animation: spin-very-slow 30s linear infinite;
          }
          .animate-spin-reverse-slow {
            animation: spin-reverse-slow 25s linear infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          .animation-delay-600 {
            animation-delay: 0.6s;
          }
          .animation-delay-800 {
            animation-delay: 0.8s;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `
      }} />
    </section>
  );
}