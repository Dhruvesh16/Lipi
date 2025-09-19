import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export default function Testimonials() {
  // todo: remove mock functionality - replace with real testimonials from API
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Family Medicine Physician",
      organization: "Springfield Medical Center",
      quote: "Lipi has completely transformed how I document patient visits. I'm saving 2+ hours every day and can focus entirely on my patients during consultations.",
      avatar: "SJ"
    },
    {
      name: "Dr. Michael Chen",
      role: "Internal Medicine",
      organization: "Metro Health Partners",
      quote: "The accuracy is incredible. Lipi captures medical terminology perfectly and generates notes that are more detailed than I could write manually.",
      avatar: "MC"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      organization: "Children's Healthcare Group",
      quote: "With Lipi, my documentation is completed before I even leave the patient room. It's truly revolutionized our practice efficiency.",
      avatar: "ER"
    },
    {
      name: "Dr. David Thompson",
      role: "Orthopedic Surgeon",
      organization: "Advanced Orthopedics",
      quote: "The multi-speaker recognition works flawlessly even during complex consultations. Lipi has reduced my administrative burden significantly.",
      avatar: "DT"
    },
    {
      name: "Dr. Lisa Park",
      role: "Cardiology",
      organization: "Heart Care Specialists",
      quote: "Integration with our EHR system was seamless. Lipi has improved both the quality and speed of our clinical documentation.",
      avatar: "LP"
    },
    {
      name: "Dr. Robert Miller",
      role: "Emergency Medicine",
      organization: "City General Hospital",
      quote: "In the fast-paced ED environment, Lipi helps me maintain thorough documentation without slowing down patient care.",
      avatar: "RM"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Physicians Say About Lipi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of healthcare professionals who have transformed their practice with AI-powered medical transcription
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-primary/60" data-testid={`icon-quote-${index}`} />
                </div>

                {/* Quote Text */}
                <blockquote className="text-foreground mb-6 leading-relaxed" data-testid={`text-testimonial-${index}-quote`}>
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground" data-testid={`text-testimonial-${index}-name`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-${index}-role`}>
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-${index}-organization`}>
                      {testimonial.organization}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary" data-testid="text-stat-physicians">50,000+</div>
              <div className="text-muted-foreground">Physicians Trust Lipi</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary" data-testid="text-stat-notes">2M+</div>
              <div className="text-muted-foreground">Clinical Notes Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary" data-testid="text-stat-time-saved">100,000+</div>
              <div className="text-muted-foreground">Hours Saved Monthly</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary" data-testid="text-stat-accuracy">99.2%</div>
              <div className="text-muted-foreground">Average Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}