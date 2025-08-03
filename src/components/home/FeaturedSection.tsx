
import { GraduationCap, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FeaturedSection = () => {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-neon-green" />,
      title: "Expert Instructors",
      description: "Learn from industry-recognized cybersecurity professionals with years of hands-on experience."
    },
    {
      icon: <Award className="h-8 w-8 text-neon-green" />,
      title: "Certification Ready",
      description: "Our courses are designed to prepare you for top cybersecurity certifications and real-world challenges."
    },
    {
      icon: <Users className="h-8 w-8 text-neon-green" />,
      title: "Supportive Community",
      description: "Join a community of cybersecurity professionals and fellow students for networking and collaboration."
    }
  ];

  return (
    <section id="about" className="py-20 bg-cyber-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-mono font-bold mb-4">Why Choose <span className="text-neon-green">CyberSanctuary</span></h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We provide comprehensive cybersecurity education for professionals at all skill levels, from beginners to advanced practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="cyber-border bg-cyber-light p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-mono font-semibold mb-3">{feature.title}</h3>
              <p className="text-white/70 mb-4">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/courses">
            <Button variant="outline" className="btn-cyber">
              Explore Our Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
