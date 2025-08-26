import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResultatsNationals from './Resultats_Nationals';
import ClassementNationals from './Classement_Nationals';
import ResultatsRegionalWest from './Resultats_Regional_West';
import ClassementRegionalWest from './Classement_Regional_West';
import ResultatsRegionalEast from './Resultats_Regional_East';
import ClassementRegionalEast from './Classement_Regional_East';
import Scorers from './Scorers';


export default function SwissCup(props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(props.initialTab || 'nationals');
  const [tablesNationals, setTablesNationals] = useState(() => {
    const saved = localStorage.getItem('resultatsData_nationals');
    return saved ? JSON.parse(saved) : [];
  });
  const [tablesWest, setTablesWest] = useState(() => {
    const saved = localStorage.getItem('resultatsData_regionalWest');
    return saved ? JSON.parse(saved) : [];
  });
  const [tablesEast, setTablesEast] = useState(() => {
    const saved = localStorage.getItem('resultatsData_regionalEast');
    return saved ? JSON.parse(saved) : [];
  });
  // Ajout du state pour les sous-onglets (doit être AVANT le return)
  const [nationalsSubTab, setNationalsSubTab] = useState(props.initialTab === 'nationals' && props.initialSubTab === 'standings' ? 'standings' : 'results');
  const [westSubTab, setWestSubTab] = useState(props.initialTab === 'regionalWest' && props.initialSubTab === 'standings' ? 'standings' : 'results');
  const [eastSubTab, setEastSubTab] = useState(props.initialTab === 'regionalEast' && props.initialSubTab === 'standings' ? 'standings' : 'results');

  // Synchronise l'onglet cible si demandé
  useEffect(() => {
    if (props.initialTab && props.initialSubTab && props.onTabSync) {
      props.onTabSync();
    }
    // eslint-disable-next-line
  }, []);

  // Keep tables in sync with localStorage (in case of admin import/reset in another tab)
  React.useEffect(() => {
    const sync = () => {
      const savedN = localStorage.getItem('resultatsData_nationals');
      setTablesNationals(savedN ? JSON.parse(savedN) : []);
      const savedW = localStorage.getItem('resultatsData_regionalWest');
      setTablesWest(savedW ? JSON.parse(savedW) : []);
      const savedE = localStorage.getItem('resultatsData_regionalEast');
      setTablesEast(savedE ? JSON.parse(savedE) : []);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Onglet Nationals réactivé
  const tabs = [
    { key: 'nationals', label: t('National') },
    { key: 'regionalWest', label: t('Regional West') },
    { key: 'regionalEast', label: t('Regional East') },
    { key: 'topscorer', label: t('Top Scorer') },
  ];

  const tabBtnStyle = (active) => ({
    background: active ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
    color: active ? '#fff' : '#c00',
    border: 'none',
    borderBottom: active ? '3px solid #fff' : '3px solid transparent',
    borderRadius: 0,
    padding: '16px 38px',
    fontWeight: 700,
    fontSize: '1.08rem',
    cursor: 'pointer',
    boxShadow: active ? '0 2px 12px #c003' : 'none',
    transition: 'all 0.16s',
    outline: 'none',
    minWidth: 120,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    letterSpacing: '0.04em',
    textShadow: active ? '0 2px 8px #a00a' : 'none',
    textTransform: 'uppercase',
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
  });

  return (
    <div style={{ width: '100vw', maxWidth: '100%', margin: '48px 0', padding: 0, background: 'rgba(255,255,255,0.98)', boxShadow: '0 2px 16px #c0020a', border: '1.5px solid #f8d7da', borderRadius: 16, minHeight: 320, overflowX: 'auto' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'none', border: 'none', boxShadow: 'none', fontFamily: 'Oswald, Arial Black, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', minHeight: 64, gap: 0, borderRadius: '16px 16px 0 0', borderBottom: '1.5px solid #f8d7da' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={tabBtnStyle(activeTab === tab.key)}
            title={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1, padding: '32px 0', minHeight: 220 }}>
        {activeTab === 'nationals' && (
          <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
            {/* Sous-onglets Nationals */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
              <button
                onClick={() => setNationalsSubTab('results')}
                style={{
                  background: nationalsSubTab === 'results' ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                  color: nationalsSubTab === 'results' ? '#fff' : '#c00',
                  border: 'none',
                  borderBottom: nationalsSubTab === 'results' ? '3px solid #fff' : '3px solid transparent',
                  borderRadius: '12px 12px 0 0',
                  padding: '12px 38px',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: nationalsSubTab === 'results' ? '0 2px 12px #c003' : 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 120,
                  textTransform: 'uppercase',
                  fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                }}
              >Results</button>
              <button
                onClick={() => setNationalsSubTab('standings')}
                style={{
                  background: nationalsSubTab === 'standings' ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                  color: nationalsSubTab === 'standings' ? '#fff' : '#c00',
                  border: 'none',
                  borderBottom: nationalsSubTab === 'standings' ? '3px solid #fff' : '3px solid transparent',
                  borderRadius: '12px 12px 0 0',
                  padding: '12px 38px',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: nationalsSubTab === 'standings' ? '0 2px 12px #c003' : 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 120,
                  textTransform: 'uppercase',
                  fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                }}
              >Standings</button>
            </div>
            <div>
              {nationalsSubTab === 'results' && (
                <ResultatsNationals tablesNationals={tablesNationals} setTablesNationals={setTablesNationals} {...props} />
              )}
              {nationalsSubTab === 'standings' && (
                <ClassementNationals tablesNationals={tablesNationals} {...props} />
              )}
            </div>
          </div>
        )}
        {activeTab === 'regionalWest' && (
          <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
            {/* Sous-onglets Regional West */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
              <button
                onClick={() => setWestSubTab('results')}
                style={{
                  background: westSubTab === 'results' ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                  color: westSubTab === 'results' ? '#fff' : '#c00',
                  border: 'none',
                  borderBottom: westSubTab === 'results' ? '3px solid #fff' : '3px solid transparent',
                  borderRadius: '12px 12px 0 0',
                  padding: '12px 38px',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: westSubTab === 'results' ? '0 2px 12px #c003' : 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 120,
                  textTransform: 'uppercase',
                  fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                }}
              >Results</button>
              <button
                onClick={() => setWestSubTab('standings')}
                style={{
                  background: westSubTab === 'standings' ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                  color: westSubTab === 'standings' ? '#fff' : '#c00',
                  border: 'none',
                  borderBottom: westSubTab === 'standings' ? '3px solid #fff' : '3px solid transparent',
                  borderRadius: '12px 12px 0 0',
                  padding: '12px 38px',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: westSubTab === 'standings' ? '0 2px 12px #c003' : 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 120,
                  textTransform: 'uppercase',
                  fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                }}
              >Standings</button>
            </div>
            <div>
              {westSubTab === 'results' && (
                <ResultatsRegionalWest tablesWest={tablesWest} setTablesWest={setTablesWest} {...props} />
              )}
              {westSubTab === 'standings' && (
                <ClassementRegionalWest tablesWest={tablesWest} {...props} />
              )}
            </div>
          </div>
        )}
        {activeTab === 'regionalEast' && (
          <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
            {/* Sous-onglets Regional East */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
              <button
                onClick={() => setEastSubTab('results')}
                style={{
                  background: eastSubTab === 'results' ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                  color: eastSubTab === 'results' ? '#fff' : '#c00',
                  border: 'none',
                  borderBottom: eastSubTab === 'results' ? '3px solid #fff' : '3px solid transparent',
                  borderRadius: '12px 12px 0 0',
                  padding: '12px 38px',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: eastSubTab === 'results' ? '0 2px 12px #c003' : 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 120,
                  textTransform: 'uppercase',
                  fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                }}
              >Results</button>
              <button
                onClick={() => setEastSubTab('standings')}
                style={{
                  background: eastSubTab === 'standings' ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                  color: eastSubTab === 'standings' ? '#fff' : '#c00',
                  border: 'none',
                  borderBottom: eastSubTab === 'standings' ? '3px solid #fff' : '3px solid transparent',
                  borderRadius: '12px 12px 0 0',
                  padding: '12px 38px',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  boxShadow: eastSubTab === 'standings' ? '0 2px 12px #c003' : 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 120,
                  textTransform: 'uppercase',
                  fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                }}
              >Standings</button>
            </div>
            <div>
              {eastSubTab === 'results' && (
                <ResultatsRegionalEast tablesEast={tablesEast} setTablesEast={setTablesEast} {...props} />
              )}
              {eastSubTab === 'standings' && (
                <ClassementRegionalEast tablesEast={tablesEast} {...props} />
              )}
            </div>
          </div>
        )}
        {activeTab === 'topscorer' && (
          <Scorers {...props} />
        )}
      </div>
    </div>
  );
}
