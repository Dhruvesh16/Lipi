import { Card, CardContent } from "@/components/ui/card";
import micIcon from "@assets/generated_images/Medical_microphone_icon_fb17450d.png";
import conversationIcon from "@assets/generated_images/Doctor_patient_conversation_icon_8038e8c1.png";
import documentIcon from "@assets/generated_images/Medical_document_icon_cbb5c5c7.png";
import { FileText, CheckCircle, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.step-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-slide-in-up');
              }, index * 200);
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

  const steps = [
    {
      number: 1,
      title: "Listens to the conversation",
      description: "Lipi listens to patient-provider conversations to help document clinical information accurately and efficiently.",
      icon: micIcon,
      alt: "Illustration of microphone shows how Lipi AI Medical Scribe listens to conversations",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      number: 2,
      title: "Generates a dialogue flow", 
      description: "Lipi uses AI and voice recognition technology to create a transcript of the dialogue flow between providers and patients.",
      icon: conversationIcon,
      alt: "Illustration of patient provider conversation shows how Lipi AI Medical Scribe generates dialogue flow",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-500/10 to-blue-500/10"
    },
    {
      number: 3,
      title: "Creates a clinical document draft",
      description: "Lipi categorizes the summarized content into appropriate Progress Note sections and allows for reviewing and importing relevant data for clinical documentation.",
      icon: documentIcon,
      alt: "Illustration of document shows how Lipi AI Medical Scribe creates clinical document drafts",
      gradient: "from-sky-500 to-blue-500",
      bgGradient: "from-sky-500/10 to-blue-500/10"
    },
    {
      number: 4,
      title: "Assists with order entry",
      description: "Lipi's draft captures labs, imaging, procedures, medication orders, and follow-up visit details.",
      icon: FileText,
      alt: "Illustration shows how Lipi AI Medical Scribe assists with order entry",
      gradient: "from-blue-500 to-sky-500",
      bgGradient: "from-blue-500/10 to-sky-500/10"
    },
    {
      number: 5,
      title: "Provides a summary for review",
      description: "Lipi streamlines the clinical documentation process by allowing healthcare providers to review summarized content for accuracy, modify if necessary, and merge pre-configured defaults with a single click.",
      icon: CheckCircle,
      alt: "Illustration shows how Lipi AI Medical Scribe generates a summary for review",
      gradient: "from-indigo-500 to-sky-500",
      bgGradient: "from-indigo-500/10 to-sky-500/10"
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/6 w-72 h-72 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-3xl animate-float-slow animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-950/50 backdrop-blur-sm px-6 py-2 text-sm mb-6 animate-fade-in-up">
            <ArrowRight className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300">Simple Process</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            <span className="block text-white">How AI Medical Scribe</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Works for You
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Transform patient conversations into structured clinical notes with our 5-step AI-powered process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connection Arrow - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden xl:flex absolute top-20 -right-4 z-20 items-center">
                  <div className="w-8 h-px bg-gradient-to-r from-blue-500/50 to-indigo-500/50"></div>
                  <ArrowRight className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
              )}

              <Card className="step-card h-full relative overflow-hidden bg-black/20 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 opacity-0 group">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Animated Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}></div>
                
                <CardContent className="p-8 relative z-10">
                  {/* Step Number with Animation */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur-sm`}></div>
                      <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-white font-bold text-xl">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Icon with Hover Effect */}
                  <div className="mb-8 flex justify-center">
                    {typeof step.icon === 'string' ? (
                      <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-md`}></div>
                        <img 
                          src={step.icon} 
                          alt={step.alt}
                          className="relative w-20 h-20 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-xl opacity-20 group-hover:opacity-40 blur-sm`}></div>
                        <step.icon className="relative w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors duration-300 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Floating Dots */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient} animate-bounce`}></div>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient} animate-bounce animation-delay-200`}></div>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient} animate-bounce animation-delay-400`}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-950/50 to-blue-950/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">Ready to streamline your workflow?</h3>
              <p className="text-gray-300">Start documenting with AI assistance today</p>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-400 animate-pulse" />
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
          
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
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
          
          .animate-slide-in-up {
            animation: slide-in-up 0.8s ease-out forwards;
          }
          
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
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