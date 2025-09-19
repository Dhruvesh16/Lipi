import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mic, 
  FileText, 
  Brain, 
  Clock, 
  Shield, 
  Zap,
  Stethoscope,
  Users,
  BarChart3,
  Monitor
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-slide-in-up');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Mic,
      title: "Real-time Voice Transcription",
      description: "Capture conversations with 99.5% accuracy in real-time. Works with any accent or medical terminology.",
      gradient: "from-blue-500 to-indigo-500",
      color: "text-blue-400"
    },
    {
      icon: Brain,
      title: "AI Clinical Intelligence",
      description: "Advanced AI that understands medical context and automatically structures notes according to clinical standards.",
      gradient: "from-indigo-500 to-blue-500",
      color: "text-indigo-400"
    },
    {
      icon: FileText,
      title: "Instant Documentation",
      description: "Generate structured clinical notes, care plans, and reports instantly. HIPAA compliant and EHR ready.",
      gradient: "from-sky-500 to-blue-500",
      color: "text-sky-400"
    },
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "Enterprise-grade security with end-to-end encryption. Your patient data is always protected.",
      gradient: "from-blue-500 to-sky-500",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share notes securely with your team. Collaborate on patient care with real-time updates.",
      gradient: "from-indigo-500 to-sky-500",
      color: "text-indigo-400"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Monitor time spent on documentation vs patient care. Optimize your workflow efficiency.",
      gradient: "from-sky-500 to-indigo-500",
      color: "text-sky-400"
    },
    {
      icon: Monitor,
      title: "Mobile Ready",
      description: "Access your medical scribe on any device. iOS, Android, and web applications available.",
      gradient: "from-blue-500 to-indigo-500",
      color: "text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track documentation time savings, accuracy metrics, and workflow improvements with detailed analytics.",
      gradient: "from-indigo-500 to-blue-500",
      color: "text-indigo-400"
    }
  ];

  return (
    <section ref={sectionRef} id="features" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-950/50 backdrop-blur-sm px-6 py-2 text-sm mb-6 animate-fade-in-up">
            <Zap className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300">Powerful Features</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            <span className="block text-white">Accurate and Efficient</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Transcription Tools
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Lipi's AI-powered transcription tool helps clinicians streamline their workflow and reduce documentation burdens. 
            As a trusted digital scribe, Lipi listens to patient visits and generates comprehensive clinical notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="feature-card group relative overflow-hidden bg-black/20 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 opacity-0"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              <CardHeader className="relative z-10">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm`}></div>
                  <div className="relative w-14 h-14 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`w-7 h-7 ${feature.color} group-hover:animate-pulse`} />
                  </div>
                </div>
                
                <CardTitle className="text-xl text-white group-hover:text-blue-200 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </CardContent>

              {/* Floating Dots */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} animate-bounce`}></div>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} animate-bounce animation-delay-200`}></div>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} animate-bounce animation-delay-400`}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-20">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-blue-950/80 to-indigo-950/80 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl"></div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Practice?
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of healthcare providers who have reduced their documentation time by up to 2 hours per day with Lipi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                  onClick={() => console.log('Start free trial clicked')}
                >
                  <span className="relative z-10">Start Free Trial</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                
                <button 
                  className="group px-10 py-4 border border-blue-500/30 text-blue-300 hover:bg-blue-950/50 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  onClick={() => console.log('Schedule demo clicked')}
                >
                  Schedule Demo
                </button>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-8 left-8 w-20 h-20 border border-purple-500/20 rounded-full animate-spin-slow"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 border border-blue-500/20 rounded-full animate-spin-reverse-slow"></div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-in-up {
            from {
              opacity: 0;
              transform: translateY(60px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes spin-reverse-slow {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          
          .animate-slide-in-up {
            animation: slide-in-up 0.8s ease-out forwards;
          }
          
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          
          .animate-spin-reverse-slow {
            animation: spin-reverse-slow 6s linear infinite;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `
      }} />
    </section>
  );
}