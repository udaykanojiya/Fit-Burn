import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Forms states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', includes: '', image: '', recommended: false });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [imageSourceType, setImageSourceType] = useState('url'); // 'url' or 'file'
  const [assignData, setAssignData] = useState({ userId: '', courseId: '' });
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      navigate('/login');
      return;
    }

    if (activeTab === 'users') {
      fetchUsers(token);
    } else if (activeTab === 'courses') {
      fetchCourses();
      fetchAssignments(token);
    }
  }, [activeTab, navigate]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const fetchAssignments = async (token) => {
    try {
      const res = await fetch('/api/admin/assignments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        alert('User added successfully');
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        fetchUsers(token);
      } else {
        const data = await res.json();
        alert(data.message || 'Error adding user');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `/api/admin/courses/${editingCourseId}` : '/api/admin/courses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        alert(isEditing ? 'Course updated successfully' : 'Course added successfully');
        handleCancelEdit();
        fetchCourses();
      } else {
        const data = await res.json();
        alert(data.message || 'Error processing course');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleEditCourse = (course) => {
    setNewCourse({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      includes: course.includes || '',
      image: course.image || '',
      recommended: !!course.recommended
    });
    setIsEditing(true);
    setEditingCourseId(course.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCourseId(null);
    setNewCourse({ title: '', description: '', duration: '', includes: '', image: '', recommended: false });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCourse({ ...newCourse, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/assign-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assignData)
      });
      if (res.ok) {
        alert('Course assigned successfully');
        setAssignData({ userId: '', courseId: '' });
        fetchAssignments(token);
      } else {
        const data = await res.json();
        alert(data.message || 'Error assigning course');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleRemoveAssignment = async (userId, courseId) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/assignments/${userId}/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAssignments(token);
      } else {
        alert('Failed to remove assignment');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This will also remove it from all assigned users.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Course deleted successfully');
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/user-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      });
      if (res.ok) {
        fetchUsers(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF0F5', minHeight: '100vh' }}>
      {/* Dashboard Top bar */}
      <div style={{ backgroundColor: 'var(--color-dark)', color: 'white', padding: '1rem 0' }}>
        <div className="container dashboard-header-flex" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Admin Dashboard</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Admin Mode</span>
            <button className="btn" style={{ background: 'transparent', border: 'none', color: 'white' }} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('users')}
          >Manage Users</button>
          <button 
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('courses')}
          >Manage Courses</button>
        </div>

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Add New User</h3>
              <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <input 
                  type="text" required placeholder="Name" 
                  value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                />
                <input 
                  type="email" required placeholder="Email" 
                  value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                />
                <input 
                  type="password" required placeholder="Password" 
                  value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                />
                <select 
                  value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="btn btn-primary" style={{ height: '100%' }}>Add User</button>
              </form>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>User List</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F48FB1' }}>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #FCE4EC' }}>
                        <td style={{ padding: '1rem' }}>{u.name}</td>
                        <td style={{ padding: '1rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>{u.role}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                            backgroundColor: u.is_active ? '#E8F5E9' : '#FFEBEE',
                            color: u.is_active ? '#2E7D32' : '#C62828'
                          }}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            onClick={() => toggleUserStatus(u.id, u.is_active)}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Course' : 'Create Course'}</h3>
              <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" required placeholder="Course Title" 
                  value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                />
                <input 
                  type="text" placeholder="Duration (e.g., 21 Days)" 
                  value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Course Image</label>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input type="radio" name="imgSrc" checked={imageSourceType === 'url'} onChange={() => setImageSourceType('url')} /> URL
                    </label>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input type="radio" name="imgSrc" checked={imageSourceType === 'file'} onChange={() => setImageSourceType('file')} /> Upload
                    </label>
                  </div>
                  
                  {imageSourceType === 'url' ? (
                    <input 
                      type="text" placeholder="Image URL" 
                      value={newCourse.image} onChange={e => setNewCourse({...newCourse, image: e.target.value})}
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                    />
                  ) : (
                    <input 
                      type="file" accept="image/*" 
                      onChange={handleFileUpload}
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1', background: '#fff' }} 
                    />
                  )}
                  {newCourse.image && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img src={newCourse.image} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #F48FB1' }} />
                    </div>
                  )}
                </div>

                <input 
                  type="text" placeholder="Includes (comma separated items)" 
                  value={newCourse.includes} onChange={e => setNewCourse({...newCourse, includes: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1' }} 
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={newCourse.recommended} onChange={e => setNewCourse({...newCourse, recommended: e.target.checked})}
                  />
                  Mark as Recommended (Popular)
                </label>
                <textarea 
                  placeholder="Course Description" 
                  value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1', minHeight: '100px' }} 
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">{isEditing ? 'Update Course' : 'Create Course'}</button>
                  {isEditing && (
                    <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>Cancel</button>
                  )}
                </div>
              </form>

              {/* Manage Existing Courses */}
              <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Manage Existing Courses</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F48FB1' }}>
                      <th style={{ padding: '1rem' }}>Course Title</th>
                      <th style={{ padding: '1rem' }}>Duration</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #FCE4EC' }}>
                        <td style={{ padding: '1rem' }}>{c.title}</td>
                        <td style={{ padding: '1rem' }}>{c.duration}</td>
                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: '#1976D2', borderColor: '#1976D2' }}
                            onClick={() => handleEditCourse(c)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: '#C62828', borderColor: '#C62828' }}
                            onClick={() => handleDeleteCourse(c.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', opacity: 0.7 }}>No courses found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Assign Course to User</h3>
              <form onSubmit={handleAssignCourse} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select
                  required
                  value={assignData.userId} 
                  onChange={e => setAssignData({...assignData, userId: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1', flexGrow: 1 }}
                  onFocus={() => { if(users.length === 0) fetchUsers(localStorage.getItem('token')) }}
                >
                  <option value="" disabled>Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <select
                  required
                  value={assignData.courseId} 
                  onChange={e => setAssignData({...assignData, courseId: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #F48FB1', flexGrow: 1 }}
                >
                  <option value="" disabled>Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary">Assign Course</button>
              </form>

              {/* Assignments List */}
              <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Current Assignments</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F48FB1' }}>
                      <th style={{ padding: '1rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Course</th>
                      <th style={{ padding: '1rem' }}>Date Assigned</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map(a => (
                      <tr key={`${a.userId}-${a.courseId}`} style={{ borderBottom: '1px solid #FCE4EC' }}>
                        <td style={{ padding: '1rem' }}>{a.userName} <br/><span style={{fontSize: '0.8rem', opacity: 0.7}}>{a.userEmail}</span></td>
                        <td style={{ padding: '1rem' }}>{a.courseTitle}</td>
                        <td style={{ padding: '1rem' }}>{new Date(a.assignedAt).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: '#C62828', borderColor: '#C62828' }}
                            onClick={() => handleRemoveAssignment(a.userId, a.courseId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {assignments.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', opacity: 0.7 }}>No assignments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
