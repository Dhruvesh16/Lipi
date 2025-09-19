import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, Users } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.testimonial-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-slide-in-up');
              }, index * 150);
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

  // todo: remove mock functionality - replace with real testimonials from API
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Family Medicine Physician",
      organization: "Springfield Medical Center",
      quote: "Lipi has completely transformed how I document patient visits. I'm saving 2+ hours every day and can focus entirely on my patients during consultations.",
      avatar: "SJ",
      gradient: "from-blue-500 to-cyan-500",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Internal Medicine",
      organization: "Metro Health Partners",
      quote: "The accuracy is incredible. Lipi captures medical terminology perfectly and generates notes that are more detailed than I could write manually.",
      avatar: "MC",
      gradient: "from-purple-500 to-pink-500",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      organization: "Children's Healthcare Group",
      quote: "With Lipi, my documentation is completed before I even leave the patient room. It's truly revolutionized our practice efficiency.",
      avatar: "ER",
      gradient: "from-green-500 to-emerald-500",
      rating: 5
    },
    {
      name: "Dr. David Thompson",
      role: "Orthopedic Surgeon",
      organization: "Advanced Orthopedics",
      quote: "The multi-speaker recognition works flawlessly even during complex consultations. Lipi has reduced my administrative burden significantly.",
      avatar: "DT",
      gradient: "from-orange-500 to-red-500",
      rating: 5
    },
    {
      name: "Dr. Lisa Park",
      role: "Cardiology",
      organization: "Heart Care Specialists",
      quote: "Integration with our EHR system was seamless. Lipi has improved both the quality and speed of our clinical documentation.",
      avatar: "LP",
      gradient: "from-indigo-500 to-purple-500",
      rating: 5
    },
    {
      name: "Dr. Robert Miller",
      role: "Emergency Medicine",
      organization: "City General Hospital",
      quote: "In the fast-paced ED environment, Lipi helps me maintain thorough documentation without slowing down patient care.",
      avatar: "RM",
      gradient: "from-teal-500 to-cyan-500",
      rating: 5
    }
  ];

  return (
    <section ref={sectionRef} id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-950/50 backdrop-blur-sm px-6 py-2 text-sm mb-6 animate-fade-in-up">
            <Users className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300">Trusted by Healthcare Professionals</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            <span className="block text-white">What Physicians Say</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              About Lipi
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Join thousands of healthcare professionals who have transformed their practice with AI-powered medical transcription
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card group relative overflow-hidden bg-black/20 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 opacity-0">
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              <CardContent className="p-8 relative z-10">
                {/* Quote Icon with Gradient */}
                <div className="mb-6 relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} rounded-xl opacity-20 group-hover:opacity-30 blur-sm`}></div>
                  <div className="relative w-12 h-12 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Quote className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 text-yellow-400 fill-yellow-400`} />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-gray-300 mb-8 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 text-lg">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`bg-gradient-to-r ${testimonial.gradient} text-white font-bold text-lg`}>
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-white group-hover:text-purple-200 transition-colors duration-300 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-purple-300 font-medium">
                      {testimonial.role}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.organization}
                    </div>
                  </div>
                </div>

                {/* Floating Dots */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${testimonial.gradient} animate-bounce`}></div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${testimonial.gradient} animate-bounce animation-delay-200`}></div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${testimonial.gradient} animate-bounce animation-delay-400`}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="mt-20">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-blue-950/80 to-indigo-950/80 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {[
                  { value: "50,000+", label: "Physicians Trust Lipi", gradient: "from-blue-400 to-indigo-400" },
                  { value: "2M+", label: "Clinical Notes Generated", gradient: "from-indigo-400 to-blue-400" },
                  { value: "100,000+", label: "Hours Saved Monthly", gradient: "from-sky-400 to-blue-400" },
                  { value: "99.2%", label: "Average Accuracy Rate", gradient: "from-blue-400 to-sky-400" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Elements */}
              <div className="absolute top-8 left-8 w-16 h-16 border border-purple-500/20 rounded-full animate-spin-slow"></div>
              <div className="absolute bottom-8 right-8 w-12 h-12 border border-pink-500/20 rounded-full animate-spin-reverse-slow"></div>
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