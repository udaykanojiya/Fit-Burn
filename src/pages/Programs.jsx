import React, { useState } from 'react';
import ProgramCard from '../components/ProgramCard';
import { X, PlayCircle, FileText, CheckSquare, MessageCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  const handleMockRazorpay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      alert('Mock Payment Successful! Integrating login... You will be redirected to your dashboard.');
      navigate('/login?status=success');
    }, 2000);
  };

  const programsData = [
    {
      id: 1,
      title: "21-Day Fat Burn Challenge",
      duration: "21 Days",
      description: "Our most popular program. Kickstart your metabolism with quick, highly effective daily home workouts.",
      includes: ["Daily video workouts", "Custom diet plan PDF", "Progress tracker", "WhatsApp Community"],
      price: "₹1,499",
      image: "https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_dumbbell_workout.jpg",
      recommended: true
    },
    {
      id: 2,
      title: "30-Day Weight Loss Program",
      duration: "30 Days",
      description: "A comprehensive weight loss journey combining steady cardio, strength work, and strict nutrition.",
      includes: ["Full body routines", "Macro-counted meal plans", "Weekly weigh-ins", "Trainer access"],
      price: "₹1,999",
      image: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Postpartum Recovery",
      duration: "8 Weeks",
      description: "Safely heal your core and rebuild your strength step-by-step after childbirth.",
      includes: ["Diastasis Recti safe", "Pelvic floor focus", "Nutrition for nursing moms", "Trainer support"],
      price: "₹2,499",
      image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Advanced Fat Burn Program",
      duration: "45 Days",
      description: "Hit a plateau? Shock your system with this advanced protocol containing heavy HIIT.",
      includes: ["Advanced HIIT videos", "Carb cycling diet", "Community access"],
      price: "₹2,099",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div style={{ backgroundColor: '#FFF0F5', minHeight: '100vh', paddingBottom: '5rem' }}>
      <section className="section-padding dark-section" style={{ textAlign: 'center', minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '1rem', lineHeight: '1.2' }}>Choose Your Transformation Program</h1>
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'rgba(255,255,255,0.8)' }}>Select the program that fits your goals. Start instantly.</p>
        </div>
      </section>

      <section className="container" style={{ marginTop: '3rem' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {programsData.map(prog => (
            <div key={prog.id} style={{ height: '100%' }}>
              <ProgramCard {...prog} onViewDetails={() => setSelectedProgram(prog)} />
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Program Details */}
      {selectedProgram && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1.5fr' }}>
            <button 
              onClick={() => setSelectedProgram(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={24} />
            </button>
            <div style={{ background: `url(${selectedProgram.image}) center/cover`, minHeight: '300px' }}></div>
            <div style={{ padding: '2rem' }}>
              <span style={{ display: 'inline-block', background: 'var(--color-accent)', color: 'var(--color-primary)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>{selectedProgram.duration}</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{selectedProgram.title}</h2>
              <p style={{ color: '#2D0A1E', marginBottom: '1.5rem', lineHeight: '1.6' }}>{selectedProgram.description}</p>
              
              <h4 style={{ marginBottom: '1rem' }}>What's Included:</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><PlayCircle color="var(--color-primary)" /> Daily Workout Videos</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><FileText color="var(--color-primary)" /> Diet Plan PDF</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckSquare color="var(--color-primary)" /> Progress Tracker</li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><MessageCircle color="var(--color-primary)" /> WhatsApp Community Access</li>
              </ul>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
