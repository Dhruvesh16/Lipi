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
  BarChart3
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Mic,
      title: "Accurate Speech to Text",
      description: "State-of-the-art voice recognition technology ensures precise medical transcription with 99% accuracy.",
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI processes conversations and automatically generates structured clinical notes with relevant medical insights.",
    },
    {
      icon: FileText,
      title: "Structured Documentation",
      description: "Automatically organizes notes into standard medical formats including HPI, Assessment, and Plan sections.",
    },
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Get clinical notes within minutes of completing patient visits, dramatically reducing documentation time.",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensures all patient data is encrypted and fully compliant with healthcare regulations.",
    },
    {
      icon: Zap,
      title: "EHR Integration",
      description: "Seamlessly integrates with leading Electronic Health Record systems like Epic, Cerner, and eClinicalWorks.",
    },
    {
      icon: Stethoscope,
      title: "Medical Terminology",
      description: "Trained on extensive medical vocabulary and specialized terminology for accurate clinical documentation.",
    },
    {
      icon: Users,
      title: "Multi-Speaker Recognition",
      description: "Advanced speaker identification distinguishes between provider and patient voices in conversations.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track documentation time savings, accuracy metrics, and workflow improvements with detailed analytics.",
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Accurate and Efficient Transcription Tools 
            <br />
            <span className="text-primary">for Every Practice</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Lipi's AI-powered transcription tool helps clinicians streamline their workflow and reduce documentation burdens. 
            As a trusted digital scribe, Lipi listens to patient visits and generates comprehensive clinical notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" data-testid={`icon-feature-${index}`} />
                </div>
                <CardTitle className="text-lg" data-testid={`text-feature-${index}-title`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-feature-${index}-description`}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Practice?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of healthcare providers who have reduced their documentation time by up to 2 hours per day with Lipi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover-elevate active-elevate-2 font-medium transition-all"
                data-testid="button-start-free-trial"
                onClick={() => console.log('Start free trial clicked')}
              >
                Start Free Trial
              </button>
              <button 
                className="px-8 py-3 border border-primary text-primary rounded-lg hover-elevate active-elevate-2 font-medium transition-all"
                data-testid="button-schedule-demo"
                onClick={() => console.log('Schedule demo clicked')}
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}