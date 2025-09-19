import { Card, CardContent } from "@/components/ui/card";
import micIcon from "@assets/generated_images/Medical_microphone_icon_fb17450d.png";
import conversationIcon from "@assets/generated_images/Doctor_patient_conversation_icon_8038e8c1.png";
import documentIcon from "@assets/generated_images/Medical_document_icon_cbb5c5c7.png";
import { FileText, CheckCircle } from "lucide-react";

export default function ProcessSteps() {
  const steps = [
    {
      number: 1,
      title: "Listens to the conversation",
      description: "Lipi listens to patient-provider conversations to help document clinical information accurately and efficiently.",
      icon: micIcon,
      alt: "Illustration of microphone shows how Lipi AI Medical Scribe listens to conversations"
    },
    {
      number: 2,
      title: "Generates a dialogue flow", 
      description: "Lipi uses AI and voice recognition technology to create a transcript of the dialogue flow between providers and patients.",
      icon: conversationIcon,
      alt: "Illustration of patient provider conversation shows how Lipi AI Medical Scribe generates dialogue flow"
    },
    {
      number: 3,
      title: "Creates a clinical document draft",
      description: "Lipi categorizes the summarized content into appropriate Progress Note sections and allows for reviewing and importing relevant data for clinical documentation.",
      icon: documentIcon,
      alt: "Illustration of document shows how Lipi AI Medical Scribe creates clinical document drafts"
    },
    {
      number: 4,
      title: "Assists with order entry",
      description: "Lipi's draft captures labs, imaging, procedures, medication orders, and follow-up visit details.",
      icon: FileText,
      alt: "Illustration shows how Lipi AI Medical Scribe assists with order entry"
    },
    {
      number: 5,
      title: "Provides a summary for review",
      description: "Lipi streamlines the clinical documentation process by allowing healthcare providers to review summarized content for accuracy, modify if necessary, and merge pre-configured defaults with a single click.",
      icon: CheckCircle,
      alt: "Illustration shows how Lipi AI Medical Scribe generates a summary for review"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How AI Medical Scribe Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform patient conversations into structured clinical notes with our 5-step AI-powered process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="h-full hover-elevate transition-all duration-200">
                <CardContent className="p-6">
                  {/* Step Number */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-lg" data-testid={`text-step-${step.number}`}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    {typeof step.icon === 'string' ? (
                      <img 
                        src={step.icon} 
                        alt={step.alt}
                        className="w-16 h-16 opacity-80"
                        data-testid={`img-step-${step.number}-icon`}
                      />
                    ) : (
                      <step.icon className="w-16 h-16 text-primary/70" data-testid={`icon-step-${step.number}`} />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-3" data-testid={`text-step-${step.number}-title`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-${step.number}-description`}>
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connection Line - only show for non-last items in desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}