import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, X } from 'lucide-react';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header>
      <div className="container" style={{ position: 'relative' }}>
        <Link to="/" className="logo">
          <Flame size={28} color="#C2185B" />
          Burn <span>IT Out</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
          <Link to="/programs" className={isActive('/programs')}>Programs</Link>
          <Link to="/success-stories" className={isActive('/success-stories')}>Success Stories</Link>
          <Link to="/blog" className={isActive('/blog')}>Blog</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>
        </nav>
        
        <div className="nav-actions desktop-only">
          <Link to="/login" className="login-link">Login</Link>
          <Link to="/programs" className="btn btn-primary">View Programs</Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="mobile-menu-btn mobile-only" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={32} /> : <Menu size={32} />}
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <Link to="/" className={isActive('/')} onClick={toggleSidebar}>Home</Link>
          <Link to="/about" className={isActive('/about')} onClick={toggleSidebar}>About</Link>
          <Link to="/programs" className={isActive('/programs')} onClick={toggleSidebar}>Programs</Link>
          <Link to="/success-stories" className={isActive('/success-stories')} onClick={toggleSidebar}>Success Stories</Link>
          <Link to="/blog" className={isActive('/blog')} onClick={toggleSidebar}>Blog</Link>
          <Link to="/contact" className={isActive('/contact')} onClick={toggleSidebar}>Contact</Link>
          <hr style={{ borderColor: 'rgba(0,0,0,0.1)', margin: '1rem 0' }} />
          <Link to="/login" className="login-link" onClick={toggleSidebar}>Login</Link>
          <Link to="/programs" className="btn btn-primary" style={{ textAlign: 'center', marginTop: '1rem' }} onClick={toggleSidebar}>View Programs</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
