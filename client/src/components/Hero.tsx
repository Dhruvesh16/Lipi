import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import soundwaveImage from "@assets/generated_images/Medical_AI_soundwave_animation_3ab45fc1.png";

export default function Hero() {
  const handleWatchDemo = () => {
    console.log('Watch demo clicked');
    // todo: remove mock functionality - integrate with video player
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm">
            <span className="text-muted-foreground">Trusted by over</span>
            <span className="ml-1 font-semibold text-foreground">50,000+ physicians</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              The Best AI Medical Scribe 
              <br />
              <span className="text-primary">for Physicians</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Lipi frees you from the keyboard so you can focus on your patients—not your screen. 
              It listens during the visit and turns real conversations into accurate clinical notes in seconds.
            </p>
          </div>

          {/* Soundwave Visual */}
          <div className="flex justify-center py-8">
            <div className="relative w-full max-w-2xl">
              <img 
                src={soundwaveImage} 
                alt="Animated soundwave representing AI Medical Scribe by Lipi"
                className="w-full h-auto opacity-90"
                data-testid="img-soundwave"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse"></div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              data-testid="button-hero-get-started"
              className="px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleWatchDemo}
              data-testid="button-watch-demo"
              className="px-8"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">2 hours</div>
              <div className="text-sm text-muted-foreground">saved daily on documentation</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">40%</div>
              <div className="text-sm text-muted-foreground">faster clinical workflows</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">99%</div>
              <div className="text-sm text-muted-foreground">transcription accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}