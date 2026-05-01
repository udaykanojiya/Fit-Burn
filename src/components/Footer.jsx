import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="logo" style={{ color: 'white', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center' }}>
              <img src={logoImg} alt="Burn It Out Logo" style={{ height: '40px', objectFit: 'contain', marginRight: '0.5rem', borderRadius: '50%' }} />
              Burn It <span style={{ color: 'var(--color-primary)', marginLeft: '0.25rem' }}>Out Fitness</span>
            </Link>
            <p style={{ color: '#a0a0a0', marginTop: '1rem' }}>
              Personalized fitness programs designed for real women with real goals. Start your transformation today.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="https://wa.me/something" target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/programs">Our Programs</Link></li>
              <li><Link to="/success-stories">Success Stories</Link></li>
              <li><Link to="/blog">Blog & Tips</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Programs</h4>
            <ul>
              <li><Link to="/programs">Fat Burn Challenge</Link></li>
              <li><Link to="/programs">30-Day Weight Loss</Link></li>
              <li><Link to="/programs">Postpartum Recovery</Link></li>
              <li><Link to="/programs">Beginner Fitness Plan</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">FAQ</Link></li>
              <li><Link to="/login">Member Login</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Burn IT Out Fitness. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
