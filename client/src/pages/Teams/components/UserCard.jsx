import React from 'react';
import './UserCard.css';

const UserCard = ({ user, selected, onToggleSelect }) => {
  return (
    <div className={`user-card ${selected ? 'selected' : ''}`}>
      <div className="user-header">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="user-info">
          <h4 className="user-name">{user.name}</h4>
          <p className="user-email">{user.email}</p>
          <p className="user-experience">{user.experience_level}</p>
        </div>
        <div className="compatibility">
          {user.compatibility}%
        </div>
      </div>

      <div className="user-skills">
        <strong>Habilidades:</strong>
        <div className="skills-list">
          {user.skills?.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-badge">{skill}</span>
          ))}
          {user.skills?.length > 4 && (
            <span className="skill-more">+{user.skills.length - 4}</span>
          )}
        </div>
      </div>

      {user.interests && user.interests.length > 0 && (
        <div className="user-interests">
          <strong>Intereses:</strong>
          <div className="interests-list">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span key={index} className="interest-badge">{interest}</span>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={onToggleSelect}
        className={`select-btn ${selected ? 'selected' : ''}`}
      >
        {selected ? '✅ Seleccionado' : '➕ Invitar al equipo'}
      </button>
    </div>
  );
};

export default UserCard;