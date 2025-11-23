import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import './employeeProfileStyle.css';

const readSaved = () => {
  try { return JSON.parse(localStorage.getItem('employeeProfileData')) || {}; } catch (e) { return {}; }
}

export default function EmployeePorfilePersonalizable(){
  const navigate = useNavigate();
  const saved = readSaved();

    const [name, setName] = useState(saved.name || 'Ashley Brown');
    const [title, setTitle] = useState(saved.title || 'Técnica informática');
    const [bio, setBio] = useState(saved.bio || 'Profesional con amplia experiencia en sistemas y redes.');
  
    const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="100%" height="100%" fill="%23e6eefb" /></svg>')}`;
    const [avatar, setAvatar] = useState(saved.avatar || '');
  const bioRef = useRef(null);

  const resizeBio = () => {
    const el = bioRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  useEffect(() => {

    resizeBio();
    const onResize = () => resizeBio();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [email, setEmail] = useState(saved.contact?.email || 'AshleyBrown@gmail.com');
  const [city, setCity] = useState(saved.contact?.city || 'Ikoyi');
  const [stateVal, setStateVal] = useState(saved.contact?.state || 'Lagos');
  const [country, setCountry] = useState(saved.contact?.country || 'USA');
  const [phone, setPhone] = useState(saved.contact?.phone || '(+234)802-446-8361');

  const handleSave = () => {
    const payload = {
      name, title, bio,
      avatar,
      contact: { email, city, state: stateVal, country, phone }
    };
    localStorage.setItem('employeeProfileData', JSON.stringify(payload));
    navigate('/employeeprofile');
  }
  

    const handleAvatarChange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
      };
      reader.readAsDataURL(file);
    };

  return (
    <div className="ep-page">
      <Header />
      <main className="ep-main">
        <section className="ep-top">
          <div className="ep-hero">
            <div className="ep-controls-wrapper">
              <div className="ep-controls">
                <div className="ep-badge">Empleado</div>
              </div>
            </div>
            <div className="ep-hero-actions">
              <button className="ef-range ef-cancel" onClick={() => navigate('/employeeprofile')}>Descartar cambios</button>
              <button className="ef-range" onClick={handleSave}>Guardar cambios</button>
            </div>
            <div className="ep-hero-shapes" aria-hidden></div>
            <img src={avatar || defaultAvatar} alt="avatar" className="ep-avatar" />
            <div style={{ position: 'absolute', left: '50%', top: 'calc(50% + 105px)', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <label className="BottonEditar"  style={{ cursor: 'pointer', fontSize: 13, background: '#fff', borderRadius: 6, padding: '4px 10px', boxShadow: '0 2px 8px #0001', display: 'inline-block' }}>
                Cambiar foto
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </label>
            </div>
          </div>
          <div className="ep-info">
            <input className="ep-input ep-name-input" value={name} onChange={e=>setName(e.target.value)} />
            <input className="ep-input ep-title-input" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea ref={bioRef} className="ep-input ep-bio-input" value={bio} onChange={e=>{setBio(e.target.value); resizeBio();}} onInput={resizeBio} />
          </div>
        </section>

        <section className="ep-content">
          <div className="ep-left">
            <div className="ef-meetings-card">
              <h3>Meetings</h3>
              <div className="ef-meetings-list">
                {[1,2,3,4].map(i => (<div key={i} className="ef-meeting-row"><div className="m-plus">+</div></div>))}
              </div>
            </div>
            <div className="ef-chart-card">
            </div>
          </div>
          <aside className="ep-right">
            <div className="ep-contact">
              <h3>Contact</h3>
              <ul>
                <li><strong>Email:</strong> <input className="ep-input" value={email} onChange={e=>setEmail(e.target.value)} /></li>
                <li><strong>City:</strong> <input className="ep-input" value={city} onChange={e=>setCity(e.target.value)} /></li>
                <li><strong>State:</strong> <input className="ep-input" value={stateVal} onChange={e=>setStateVal(e.target.value)} /></li>
                <li><strong>Country:</strong> <input className="ep-input" value={country} onChange={e=>setCountry(e.target.value)} /></li>
                <li><strong>Phone:</strong> <input className="ep-input" value={phone} onChange={e=>setPhone(e.target.value)} /></li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}
