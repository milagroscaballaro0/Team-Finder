import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import './companyProfileStyle.css';

const readSaved = () => {
  try { return JSON.parse(localStorage.getItem('companyProfileData')) || {}; } catch (e) { return {}; }
}

export default function CompanyProfilePersonalizable(){
  const navigate = useNavigate();
  const saved = readSaved();

  const [name, setName] = useState(saved.name || 'Tech Company');
  const [title, setTitle] = useState(saved.title || 'Desarrollo de Software');
  const [bio, setBio] = useState(saved.bio || 'Empresa especializada en desarrollo de software y soluciones tecnológicas innovadoras para negocios de todos los tamaños, enfocada en la excelencia y la satisfacción del cliente.');
  const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="100%" height="100%" fill="%23e6eefb" /><g transform="translate(70,70)"><rect x="0" y="0" width="100" height="100" fill="%233b82f6" /><text x="50" y="65" font-family="Arial" font-size="50" font-weight="bold" fill="white" text-anchor="middle">C</text></g></svg>')}`;
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
  
  const [email, setEmail] = useState(saved.contact?.email || 'TechCompany@corp.com');
  const [city, setCity] = useState(saved.contact?.city || 'San Francisco');
  const [stateVal, setStateVal] = useState(saved.contact?.state || 'California');
  const [country, setCountry] = useState(saved.contact?.country || 'USA');
  const [phone, setPhone] = useState(saved.contact?.phone || '(+1) 555-123-4567');

  const handleSave = () => {
    const payload = {
      name, title, bio,
      avatar,
      contact: { email, city, state: stateVal, country, phone }
    };
    localStorage.setItem('companyProfileData', JSON.stringify(payload));
    navigate('/companyprofile');
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
    <div className="cp-page">
      <Header />
      <main className="cp-main">
        <section className="cp-top">
          <div className="cp-hero">
            <div className="cp-controls-wrapper">
              <div className="cp-controls">
                <div className="cp-badge">Empresa</div>
              </div>
            </div>
            <div className="cp-hero-actions">
              <button className="cf-range cf-cancel" onClick={() => navigate('/companyprofile')}>Descartar cambios</button>
              <button className="cf-range" onClick={handleSave}>Guardar cambios</button>
            </div>
            <div className="cp-hero-shapes" aria-hidden></div>
            <img src={avatar || defaultAvatar} alt="avatar" className="cp-avatar" />
            <div style={{ position: 'absolute', left: '50%', top: 'calc(50% + 105px)', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <label className="BottonEditar"  style={{ cursor: 'pointer', fontSize: 13, background: '#fff', borderRadius: 6, padding: '4px 10px', boxShadow: '0 2px 8px #0001', display: 'inline-block' }}>
                Cambiar logo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </label>
            </div>
          </div>
          <div className="cp-info">
            <input className="cp-input cp-name-input" value={name} onChange={e=>setName(e.target.value)} />
            <input className="cp-input cp-title-input" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea ref={bioRef} className="cp-input cp-bio-input" value={bio} onChange={e=>{setBio(e.target.value); resizeBio();}} onInput={resizeBio} />
          </div>
        </section>

        <section className="cp-content">
          <div className="cp-left">
            <div className="cf-meetings-card">
              <h3>Meetings</h3>
              <div className="cf-meetings-list">
                {[1,2,3,4].map(i => (<div key={i} className="cf-meeting-row"><div className="m-plus">+</div></div>))}
              </div>
            </div>
          </div>
          <aside className="cp-right">
            <div className="cp-contact">
              <h3>Contact</h3>
              <ul>
                <li><strong>Email:</strong> <input className="cp-input" value={email} onChange={e=>setEmail(e.target.value)} /></li>
                <li><strong>City:</strong> <input className="cp-input" value={city} onChange={e=>setCity(e.target.value)} /></li>
                <li><strong>State:</strong> <input className="cp-input" value={stateVal} onChange={e=>setStateVal(e.target.value)} /></li>
                <li><strong>Country:</strong> <input className="cp-input" value={country} onChange={e=>setCountry(e.target.value)} /></li>
                <li><strong>Phone:</strong> <input className="cp-input" value={phone} onChange={e=>setPhone(e.target.value)} /></li>
              </ul>
              {}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}