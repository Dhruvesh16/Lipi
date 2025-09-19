import Header from './Header';
import Hero from './Hero';
import ProcessSteps from './ProcessSteps';
import Features from './Features';
import Testimonials from './Testimonials';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProcessSteps />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}