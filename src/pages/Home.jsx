import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, PlayCircle, Star, CheckCircle2, Heart, Apple } from 'lucide-react';
import ProgramCard from '../components/ProgramCard';
import TestimonialCard from '../components/TestimonialCard';
import fitnessVideo from '../assets/fitness.mp4';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src={fitnessVideo} type="video/mp4" />
        </video>
        <div className="container hero-content">
          <h1>Burn IT Out Fitness <br/><span style={{color: 'var(--color-primary)'}}>Your Transformation Starts at Home</span></h1>
          <p>Personalized fitness programs designed for real women with real goals. No gym required.</p>
          <div className="hero-buttons">
            <Link to="/programs" className="btn btn-primary">Start Your Journey</Link>
            <Link to="/programs" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
              <PlayCircle size={20} /> View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-bar-track">
            <div className="trust-item"><Star size={18} color="#C2185B" fill="#C2185B"/> 1000+ Women Transformed</div>
            <div className="trust-item"><Flame size={18} color="#C2185B"/> 100% Home-Based</div>
            <div className="trust-item"><Heart size={18} color="#C2185B"/> Beginner Friendly</div>
            <div className="trust-item"><Apple size={18} color="#C2185B"/> Includes Nutrition Plans</div>
            
            {/* Duplicates for seamless mobile marquee scrolling */}
            <div className="trust-item mobile-only"><Star size={18} color="#C2185B" fill="#C2185B"/> 1000+ Women Transformed</div>
            <div className="trust-item mobile-only"><Flame size={18} color="#C2185B"/> 100% Home-Based</div>
            <div className="trust-item mobile-only"><Heart size={18} color="#C2185B"/> Beginner Friendly</div>
            <div className="trust-item mobile-only"><Apple size={18} color="#C2185B"/> Includes Nutrition Plans</div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>What We Offer</h2>
            <p style={{ color: '#2D0A1E', maxWidth: '600px', margin: '0 auto' }}>Programs tailored exclusively for women, focusing on sustainable results without stepping foot in a gym.</p>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Fat Loss Programs', icon: <Flame size={32} color="var(--color-primary)"/>, desc: 'High-intensity, low-impact routines to torch calories safely.' },
              { title: 'Postpartum Fitness', icon: <Heart size={32} color="var(--color-primary)"/>, desc: 'Gentle, core-healing exercises designed for new mothers.' },
              { title: 'Home Workout Plans', icon: <PlayCircle size={32} color="var(--color-primary)"/>, desc: 'Follow-along videos needing minimal to zero equipment.' },
              { title: 'Nutrition Guidance', icon: <Apple size={32} color="var(--color-primary)"/>, desc: 'Custom meal charts to complement your physical training.' }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--color-accent)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: '#2D0A1E', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding dark-section">
        <div className="container">
          <div className="grid-2-cols">
            <div>
              <img src="https://images.financialexpressdigital.com/2025/06/chatgpt-gym-woman.jpg?w=1200" alt="Workout at home" style={{ width: '100%', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-subtle)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Why Choose Burn IT Out?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  "No expensive gym memberships required",
                  "Beginner-friendly scaling for all levels",
                  "Designed specifically for busy moms and professionals",
                  "A proven transformation system backed by real results"
                ].map((text, i) => (
                  <div key={i} className="check-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={24} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>{text}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '3rem' }}>
                <Link to="/about" className="btn btn-primary">Learn More About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Programs */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-light)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Start Your Transformation</h2>
            <p style={{ color: '#2D0A1E', maxWidth: '600px', margin: '0 auto' }}>Join thousands of women who have changed their lives with these programs.</p>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <ProgramCard 
              title="21-Day Fat Burn Challenge"
              duration="21 Days"
              description="Our most popular program. Kickstart your metabolism with quick, highly effective daily home workouts."
              includes={["Daily video workouts", "Custom diet plan PDF", "Progress tracker", "WhatsApp Community"]}
              recommended={true}
              image="https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_dumbbell_workout.jpg"
            />
            <ProgramCard 
              title="Postpartum Recovery"
              duration="8 Weeks"
              description="Safely heal your core and rebuild your strength step-by-step after childbirth."
              includes={["Diastasis Recti safe", "Pelvic floor focus", "Nutrition for nursing moms", "Trainer support"]}
              image="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80"
            />
            <ProgramCard 
              title="Beginner Fitness Plan"
              duration="4 Weeks"
              description="Never worked out before? This is for you. Learn the basics with zero intimidation."
              includes={["Form tutorials", "Low impact routines", "Beginner meal guide", "Weekly check-ins"]}
              image="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
            />
          </div>
          
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/programs" className="btn btn-outline" style={{ border: '2px solid var(--color-dark)', color: 'var(--color-dark)' }}>View All Programs</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding dark-section" style={{ textAlign: 'center', backgroundColor: 'var(--color-primary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Join 1000+ women transforming their bodies at home</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem', color: 'white' }}>
            Spaces are limited! Take the first step towards a stronger, healthier, and more confident you.
          </p>
          <Link to="/programs" className="btn" style={{ backgroundColor: 'var(--color-dark)', color: 'white', fontSize: '1.2rem', padding: '1rem 2rem' }}>
            View Programs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
