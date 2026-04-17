import React from 'react';
import { Camera, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgramCard = ({ title, duration, image, description, includes, recommended, onViewDetails }) => {
  return (
    <div className="card program-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {recommended && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10 }}>
          Popular
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', paddingTop: '60%', backgroundColor: '#F8BBD0', overflow: 'hidden' }}>
        <img 
          src={image || "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"} 
          alt={title} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          <Clock size={16} /> {duration}
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: '#2D0A1E', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>{description}</p>
        
        <div style={{ borderTop: '1px solid #F48FB1', paddingTop: '1rem', marginBottom: '1.5rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {includes.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#2D0A1E' }}>
                <CheckCircle2 size={16} color="var(--color-primary)" /> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto' }}>
          {onViewDetails ? (
            <button onClick={onViewDetails} className="btn btn-primary" style={{ width: '100%', border: 'none' }}>View Details</button>
          ) : (
            <Link to="/programs" className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
