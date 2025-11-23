import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import './companyProfileStyle.css';

const MeetingsCard = () => {
	const meetings = [
		{ id: 1, date: '20 Mon', title: 'Team planning', time: '12.02 PM' },
		{ id: 2, date: '21 Mon', title: 'Sprint review', time: '12.02 PM' },
		{ id: 3, date: '24 Mon', title: 'Resource planning', time: '12.02 PM' },
		{ id: 4, date: '25 Mon', title: 'Product review', time: '12.02 PM' }
	];

	return (
		<div className="cf-meetings-card">
			<h3>Meetings</h3>
			<div className="cf-meetings-list">
				{meetings.map(m => (
					<div key={m.id} className="cf-meeting-row">
						<div className="m-plus" aria-hidden>+</div>
					</div>
				))}
			</div>
		</div>
	);
};

const EmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        role: '',
        department: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Añadir Empleado</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="form-control" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <input 
              type="text" 
              id="role" 
              name="role" 
              className="form-control" 
              value={formData.role} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Departamento</label>
            <input 
              type="text" 
              id="department" 
              name="department" 
              className="form-control" 
              value={formData.department} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Añadir Empleado</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Notification = ({ message, onClose, isError = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${isError ? 'error' : ''}`}>
      <span className="notification-icon">{isError ? '❌' : '✅'}</span>
      <span className="notification-message">{message}</span>
    </div>
  );
};

const EmployeeCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const savedEmployees = localStorage.getItem('companyEmployees');
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (e) {
        console.error('Error al cargar empleados:', e);
      }
    }
  }, []);

  const handleAddEmployee = (employeeData) => {
   
    const emailExists = employees.some(emp => emp.email.toLowerCase() === employeeData.email.toLowerCase());
    
    if (emailExists) {
      setIsError(true);
      setNotificationMessage(`Error: El email ${employeeData.email} ya está registrado`);
      setShowNotification(true);
      return;
    }
    
    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      status: 'waiting'
    };
    
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    
    localStorage.setItem('companyEmployees', JSON.stringify(updatedEmployees));
    
    setIsModalOpen(false);
    setIsError(false);
    setNotificationMessage(`Solicitud enviada a ${employeeData.name}`);
    setShowNotification(true);
  };

  const showDeleteConfirmation = (id, name, e) => {
    e.stopPropagation();
    setEmployeeToDelete({ id, name });
    setDeleteConfirmation(true);
  };
  
  const confirmDeleteEmployee = () => {
    if (!employeeToDelete) return;
    
    const { id, name } = employeeToDelete;
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    
    setEmployees(updatedEmployees);
    localStorage.setItem('companyEmployees', JSON.stringify(updatedEmployees));
    
    setIsError(false);
    setNotificationMessage(`${name} ha sido eliminado correctamente`);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    
    setDeleteConfirmation(false);
    setEmployeeToDelete(null);
  };

  return (
    <div className="employee-cards-section">
      <h2>Empleados</h2>
      <div className="employee-cards-container">
        {}
        <div className="employee-card" onClick={() => setIsModalOpen(true)}>
          <div className="employee-card-plus">+</div>
        </div>
        
        {}
        {employees.map(employee => (
          <div key={employee.id} className="employee-card employee-card-waiting">
            <div className="employee-card-content">
              <div className="employee-status">En espera de</div>
              <div className="employee-name">{employee.name}</div>
              <button 
                className="delete-employee-btn"
                onClick={(e) => showDeleteConfirmation(employee.id, employee.name, e)}
                title="Eliminar empleado"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
      
      {showNotification && (
        <Notification 
          message={notificationMessage} 
          onClose={() => setShowNotification(false)}
          isError={isError}
        />
      )}
      
      {deleteConfirmation && employeeToDelete && (
        <div className="confirmation-overlay" onClick={() => setDeleteConfirmation(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="confirmation-title">Eliminar empleado</h3>
            <p className="confirmation-message">
              ¿Estás seguro de que deseas eliminar a <strong>{employeeToDelete.name}</strong> de la lista de empleados? Esta acción no se puede deshacer.
            </p>
            <div className="confirmation-actions">
              <button 
                className="confirmation-btn cancel-btn" 
                onClick={() => setDeleteConfirmation(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirmation-btn confirm-btn" 
                onClick={confirmDeleteEmployee}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CompanyProfile() {
	const navigate = useNavigate();

	const saved = (() => {
		try {
			return JSON.parse(localStorage.getItem('companyProfileData')) || {};
		} catch (e) { return {}; }
	})();

	const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
		<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
			<rect width='100%' height='100%' fill='%23e6eefb' />
            <g transform='translate(70,70)'>
                <rect x='0' y='0' width='100' height='100' fill='%233b82f6' />
                <text x='50' y='65' font-family='Arial' font-size='50' font-weight='bold' fill='white' text-anchor='middle'>C</text>
            </g>
		</svg>
	`)}`;

	const formatEmail = (email) => {
		if (!email) return (<><strong>TechCompany</strong>@corp.com</>);
		const parts = email.split('@');
		if (parts.length === 2) return (<><strong>{parts[0]}</strong>@{parts[1]}</>);
		return email;
	};

	const handleEdit = () => navigate('/companyprofile/personalizable');

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
							<button className="cp-edit-btn" aria-label="Editar" onClick={handleEdit}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#0f1724" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="#0f1724" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
							</button>
						</div>
						<div className="cp-hero-shapes" aria-hidden></div>
						<img src={saved.avatar || defaultAvatar} alt="avatar" className="cp-avatar" />
						<div className="chat-icon" onClick={() => navigate('/chat')}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" 
								stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>
					<div className="cp-info">
						<h1 className="cp-name">{saved.name || 'Tech Company'}</h1>
						<p className="cp-title">{saved.title || 'Desarrollo de Software'}</p>
						<p className="cp-bio">{saved.bio || 'Empresa especializada en desarrollo de software y soluciones tecnológicas innovadoras para negocios de todos los tamaños, enfocada en la excelencia y la satisfacción del cliente.'}</p>
					</div>
				</section>

				<section className="cp-content">
					<div className="cp-left">
						<MeetingsCard />
					</div>
					<aside className="cp-right">
						<div className="cp-contact">
							<h3>Contact</h3>
							<ul>
								<li><strong>Email:</strong> <span>{formatEmail(saved.contact?.email || 'TechCompany@corp.com')}</span></li>
								<li><strong>City:</strong> {saved.contact?.city || 'San Francisco'}</li>
								<li><strong>State:</strong> {saved.contact?.state || 'California'}</li>
								<li><strong>Country:</strong> {saved.contact?.country || 'USA'}</li>
								<li><strong>Phone:</strong> {saved.contact?.phone || '(+1) 555-123-4567'}</li>
							</ul>
						</div>
					</aside>
				</section>
				
				<EmployeeCards />
			</main>

			<Footer />
		</div>
	);
}
