import React from 'react';
import { Home, Upload, Settings, LogOut } from 'lucide-react';
import ClickSpark from './ClickSpark';
import './Dock.css';

const Dock = ({ onNavigate, onLogout, currentPage }) => {
  const dockItems = [
    { id: 'home', icon: Home, label: 'Home', action: () => onNavigate('home') },
    { id: 'upload', icon: Upload, label: 'Upload', action: () => onNavigate('upload') },
    { id: 'settings', icon: Settings, label: 'Settings', action: () => onNavigate('settings') },
  ];

  return (
    <div className="dock-container">
      <div className="dock">
        {dockItems.map((item) => (
          <ClickSpark
            key={item.id}
            sparkColor="#58bc82"
            sparkSize={8}
            sparkRadius={20}
            sparkCount={6}
            duration={400}
          >
            <div
              className={`dock-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={item.action}
              title={item.label}
            >
              <item.icon size={24} />
            </div>
          </ClickSpark>
        ))}
        
        <div className="dock-separator" />
        
        <ClickSpark
          sparkColor="#ff6b6b"
          sparkSize={10}
          sparkRadius={25}
          sparkCount={8}
          duration={500}
        >
          <div
            className="dock-item logout"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={24} />
          </div>
        </ClickSpark>
      </div>
    </div>
  );
};

export default Dock;