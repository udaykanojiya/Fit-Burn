import React, { useState } from 'react';
import dumbells from "../assets/dumbells.png";
import postpartum from "../assets/postpartum.png";

const Blog = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Weight Loss', 'Postpartum', 'Home Workouts', 'Diet & Nutrition'];
  
  const posts = [
    {
      id: 1,
      category: 'Weight Loss',
      title: '5 Rules for Sustainable Fat Loss at Home',
      excerpt: 'Struggling to see progress outside the gym? Here are five golden rules to manipulate your metabolism naturally.',
      image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      category: 'Postpartum',
      title: 'Healing Diastasis Recti: Where to Start?',
      excerpt: 'Postpartum core healing requires patience and the right exercises. Avoid these common mistakes new moms make.',
      image: postpartum
    },
    {
      id: 3,
      category: 'Home Workouts',
      title: 'Dumbbells vs Bodyweight: Which is Better?',
      excerpt: 'Do you really need weights to tone up? We break down the science behind minimal equipment resistance training.',
      image: dumbells
    },
    {
      id: 4,
      category: 'Diet & Nutrition',
      title: 'High Protein Breakfast Ideas for Busy Moms',
      excerpt: 'Skip the cereal. These quick, 5-minute breakfast recipes will keep you full and energized throughout the day.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filteredPosts = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div>
      <section className="section-padding dark-section text-center">
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Fitness & Nutrition Tips</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
            Expert advice, recipes, and home workout strategies to accelerate your progress.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="desktop-only" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ color: filter === cat ? 'white' : 'var(--color-dark)', borderColor: filter === cat ? 'var(--color-primary)' : '#F48FB1', background: filter === cat ? 'var(--color-primary)' : 'transparent' }}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mobile-only" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.8rem 1.2rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-primary)',
                background: 'white',
                color: 'var(--color-dark)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredPosts.map(post => (
              <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--color-white)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {post.category}
                  </span>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{post.title}</h3>
                  <p style={{ color: '#2D0A1E', fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1 }}>{post.excerpt}</p>
                  <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>Read More &rarr;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
