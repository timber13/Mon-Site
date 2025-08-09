
import React from 'react';


export default function Menu({ activeTab, setActiveTab, onAdminClick }) {
  const tabs = [
    { key: 'home', label: (
      <span style={{ filter: 'drop-shadow(0 0 2px #fff)', color: '#fff', fontSize: '1.35em', lineHeight: 1, display: 'inline-block' }}>
        {/* SVG maison blanche basique */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
          <path d="M4 13L14 5L24 13V23C24 23.5523 23.5523 24 23 24H5C4.44772 24 4 23.5523 4 23V13Z" stroke="#fff" strokeWidth="2.2" fill="#fff"/>
          <rect x="10.5" y="16" width="7" height="7" rx="1.2" fill="#e30613" stroke="#fff" strokeWidth="1.2"/>
        </svg>
      </span>
    ) },
    { key: 'about', label: 'About' },
    { key: 'club', label: 'Club' },
    { key: 'swisscup', label: 'SwissCup' },
    { key: 'matchs', label: 'Calendar' },
    { key: 'nationalteam', label: 'National Team' },
    { key: 'referees', label: 'Referees' },
    { key: 'photos', label: 'Photos' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <header className="menu-bar" style={{
      width: '100vw',
      minWidth: '100vw',
      left: 0,
      right: 0,
      top: 0,
      background: 'linear-gradient(90deg, #e30613 0%, #b8000a 100%)',
      boxShadow: '0 4px 24px 0 #e3061322',
      marginBottom: 44,
      position: 'fixed',
      zIndex: 1000,
      padding: 0,
      borderBottom: '2.5px solid #fff',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '24px',
      height: 74,
      minHeight: 74,
      overflowX: 'hidden',
    }}>
      <nav
        style={{
          display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: '24px',
          alignItems: 'center',
          height: '100%',
          background: 'none',
          border: 'none',
          boxShadow: 'none',
          fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          minHeight: 64,
          gap: 0,
        }}
      >
        {tabs.map((tab, idx) => {
          if (tab.key === 'admin') {
            return (
              <button
                key={tab.key}
                onClick={onAdminClick}
                style={{
                  background: 'none',
                  color: '#fff',
                  border: 'none',
                  borderBottom: '4px solid #fff0',
                  borderRadius: 0,
                  padding: '12px 18px 10px 18px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 70,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 8px #a00a',
                  textTransform: 'uppercase',
                  position: 'relative',
                }}
              >
                {tab.label}
              </button>
            );
          }
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                color: activeTab === tab.key ? '#fff' : '#fff9',
                border: 'none',
                borderBottom: activeTab === tab.key ? '4px solid #fff' : '4px solid transparent',
                borderRadius: 0,
                padding: '12px 18px 10px 18px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'all 0.16s',
                outline: 'none',
                minWidth: 70,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                letterSpacing: '0.04em',
                textShadow: activeTab === tab.key ? '0 2px 8px #a00a' : 'none',
                textTransform: 'uppercase',
                position: 'relative',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
