
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The Advanced Penetration Testing course completely transformed my skill set. The hands-on labs and instructor guidance helped me secure a senior position in my company's security team.",
      author: "Security Engineer",
      company: "Financial Services"
    },
    {
      quote: "As someone transitioning into cybersecurity, these courses provided the perfect balance of theory and practical experience. The certification preparation was invaluable.",
      author: "Career Changer",
      company: "IT Professional"
    },
    {
      quote: "The Network Defense Strategies course has become mandatory training for our entire security operations team. The real-world scenarios reflect actual threats we face daily.",
      author: "SOC Manager",
      company: "Healthcare Organization"
    }
  ];

  return (
    <section className="py-20 bg-cyber-darker">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-mono font-bold mb-16 text-center">Trusted by <span className="text-neon-green">Security Professionals</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="cyber-border bg-cyber-dark">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="rounded-full bg-cyber-light p-2 border border-neon-green/30">
                    <User className="h-6 w-6 text-neon-green" />
                  </div>
                </div>
                <blockquote className="text-white/80 mb-6 italic text-center">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-center">
                  <p className="font-mono text-neon-green">{testimonial.author}</p>
                  <p className="text-white/60 text-sm">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
