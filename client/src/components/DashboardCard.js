import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ icon, title, value, subtitle, color, trend }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className={`card-icon ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
  );
};

export default DashboardCard;