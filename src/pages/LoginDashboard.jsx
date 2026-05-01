import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircle, DownloadCloud, Activity, Users, Settings, Mail, Lock, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const LoginDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Course State
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      setIsLoggedIn(true);
      if (parsedUser.role === 'admin') {
        navigate('/admin');
      } else {
        fetchMyCourses(token);
      }
    }
  }, [navigate]);

  const fetchMyCourses = async (token) => {
    try {
      const res = await fetch('/api/user/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        if (data.length > 0) {
          fetchCourseDetails(data[0].id, token);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourseDetails = async (courseId, token) => {
    try {
      const res = await fetch(`/api/user/course/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveCourse(data);
        
        // Auto select first video
        if (data.modules && data.modules.length > 0) {
          const firstMod = data.modules[0];
          if (firstMod.videos && firstMod.videos.length > 0) {
            setActiveVideo(firstMod.videos[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          fetchMyCourses(data.token);
        }
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoginError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          fetchMyCourses(data.token);
        }
      } else {
        setLoginError(data.message || 'Google login failed');
      }
    } catch (err) {
      setLoginError('Network error during Google login.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="section-padding" style={{ 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FCE4EC 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <div className="card" style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: '3rem', 
          boxShadow: '0 20px 40px rgba(233,30,140,0.1)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: 'var(--color-primary)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 16px rgba(233,30,140,0.2)'
            }}>
              <ShieldCheck color="white" size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: '#666' }}>Sign in to continue your transformation</p>
          </div>

          {loginError && (
            <div style={{ 
              backgroundColor: '#FFF5F5', 
              color: '#E53E3E', 
              padding: '1rem', 
              borderRadius: '12px', 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              fontSize: '0.9rem',
              border: '1px solid #FED7D7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Google Login Section */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setLoginError('Google Login Failed')}
                useOneTap
                theme="filled_blue"
                shape="pill"
                text="continue_with"
                width="100%"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#A0AEC0', fontWeight: '600' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}></div>
            </div>

            {/* Conventional Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#4A5568' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem 1rem 0.875rem 3rem', 
                      borderRadius: '12px', 
                      border: '1px solid #E2E8F0', 
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontSize: '1rem'
                    }} 
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#4A5568' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem 1rem 0.875rem 3rem', 
                      borderRadius: '12px', 
                      border: '1px solid #E2E8F0', 
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontSize: '1rem'
                    }} 
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <a href="#" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  fontSize: '1rem', 
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 12px rgba(233,30,140,0.2)'
                }}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Get Video Embed URL (convert YouTube standard link to embed link if needed)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <div style={{ backgroundColor: '#FFF0F5', minHeight: '100vh' }}>
      {/* Dashboard Top bar */}
      <div style={{ backgroundColor: 'var(--color-dark)', color: 'white', padding: '1rem 0' }}>
        <div className="container dashboard-header-flex">
          <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{activeCourse ? activeCourse.title : 'My Dashboard'}</span>
            <button className="btn" style={{ background: 'transparent', border: 'none', color: 'white' }} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="dashboard-grid">
          
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Active Video Player */}
            <div className="card" style={{ padding: '2rem' }}>
              {activeCourse ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
                      <PlayCircle color="var(--color-primary)" /> {activeVideo ? activeVideo.title : 'Select a video below'}
                    </h3>
                  </div>
                  
                  <div style={{ width: '100%', paddingTop: '56.25%', backgroundColor: '#2D0A1E', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                    {activeVideo && activeVideo.video_url ? (
                      <iframe 
                        src={getEmbedUrl(activeVideo.video_url)} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <div style={{ textAlign: 'center' }}>
                          <PlayCircle size={64} style={{ opacity: 0.8, marginBottom: '1rem' }} />
                          <p>{activeVideo ? 'Video coming soon' : 'No video selected'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {activeVideo && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary" onClick={() => alert('Progress saved!')}>Mark as Completed</button>
                    </div>
                  )}

                  <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#FFF0F5', borderRadius: '8px', border: '1px solid #FCE4EC' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>About this Course</h4>
                    <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>{activeCourse.description || 'No description available.'}</p>
                    <h5 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>What's Included:</h5>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                      {(() => {
                        let includesArray = [];
                        try {
                          if (activeCourse.includes) {
                            const parsed = JSON.parse(activeCourse.includes);
                            includesArray = Array.isArray(parsed) ? parsed : activeCourse.includes.split(',').map(s=>s.trim());
                          }
                        } catch(e) {
                          includesArray = activeCourse.includes ? activeCourse.includes.split(',').map(s=>s.trim()) : [];
                        }
                        return includesArray.length > 0 ? includesArray.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        )) : <li>Access to all course materials</li>;
                      })()}
                    </ul>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <h3>You are not assigned to any courses yet.</h3>
                  <p style={{ opacity: 0.7, marginTop: '1rem' }}>Please contact your admin.</p>
                </div>
              )}
            </div>

            {/* Modules List */}
            {activeCourse && activeCourse.modules && activeCourse.modules.length > 0 && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Course Content</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {activeCourse.modules.map((mod, i) => (
                    <div key={mod.id}>
                      <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', borderBottom: '1px solid #FCE4EC', paddingBottom: '0.5rem' }}>{mod.title}</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {mod.videos && mod.videos.map(video => (
                          <li 
                            key={video.id} 
                            onClick={() => setActiveVideo(video)}
                            style={{ 
                              display: 'flex', justifyContent: 'space-between', padding: '1rem', 
                              background: activeVideo?.id === video.id ? 'var(--color-accent)' : '#FFF0F5', 
                              border: `1px solid ${activeVideo?.id === video.id ? 'var(--color-primary)' : '#FCE4EC'}`, 
                              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                              <PlayCircle size={20} color={activeVideo?.id === video.id ? "var(--color-primary)" : "#F48FB1"} />
                              <span style={{ fontWeight: activeVideo?.id === video.id ? 'bold' : 'normal' }}>{video.title}</span>
                            </div>
                          </li>
                        ))}
                        {(!mod.videos || mod.videos.length === 0) && (
                          <li style={{ padding: '1rem', color: '#888', fontStyle: 'italic', textAlign: 'center' }}>No videos added yet</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Progress Tracker */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Activity color="var(--color-primary)" size={20} /> Progress Tracker</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#2D0A1E', display: 'block', marginBottom: '0.25rem' }}>Log Current Weight (kg)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" placeholder="e.g. 65" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #F48FB1' }} />
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Log</button>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', padding: '1rem', background: '#FFF0F5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-dark)' }}>2.5kg</div>
                  <div style={{ fontSize: '0.8rem', color: '#2D0A1E' }}>Lost so far</div>
                </div>
              </div>
            </div>

            {/* Diet Plan */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><DownloadCloud color="var(--color-primary)" size={20} /> Nutrition & Diet</h4>
              <p style={{ fontSize: '0.9rem', color: '#2D0A1E', marginBottom: '1rem' }}>Stick to the meal plans to optimize your recovery and burn.</p>
              <button className="btn btn-outline" style={{ width: '100%', color: 'var(--color-dark)', borderColor: '#F48FB1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <DownloadCloud size={16} /> Download Meal Plan
              </button>
            </div>

            {/* Community */}
            <div className="card" style={{ padding: '1.5rem', background: 'var(--color-dark)', color: 'white' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'white' }}><Users color="var(--color-primary)" size={20} /> Community Support</h4>
              <p style={{ fontSize: '0.9rem', color: '#F8BBD0', marginBottom: '1.5rem' }}>Share your wins, struggles, and get advice directly from the coaches.</p>
              <a href="#" className="btn" style={{ backgroundColor: '#E91E8C', color: 'white', width: '100%', textAlign: 'center', display: 'block' }}>
                Join WhatsApp Group
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDashboard;
