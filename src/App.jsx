// src/App.jsx

import React, { useState, useEffect } from 'react';

import Resultats from './pages/Resultats';
import About from './pages/About';
import Classement from './pages/Classement';
import Scorers from './pages/Scorers';
import Menu from './components/Menu';
import Calendar from './pages/Calendar';
import NationalTeam from './pages/NationalTeam';
import Referees from './pages/Referees';
import Photos from './pages/Photos';
import AdminPanel from './components/Admin';
import { ExcelProvider } from './contexts/ExcelContext';
import { ResultatsProvider } from './contexts/ResultatsContext';
import Home from './pages/Home';
import SwissCup from './pages/SwissCup';
import Club from './pages/Club';
import { AdminContext } from './contexts/AdminContext';

function App() {
  // Fonctions d'admin pour le panneau d'authentification
  const handleAdminLogin = () => {
    const email = adminEmail.trim().toLowerCase();
    if (!allowedAdmins.includes(email)) {
      setAdminError("Adresse email non autorisée");
      return;
    }
    const pw = getPasswords();
    if (adminPass === pw[email]) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin','true');
      localStorage.setItem('adminEmail', email);
      setShowLogin(false);
      setAdminError('');
    } else {
      setAdminError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
  };

  const handleChangePass = () => {
    if (!newPass || newPass !== confirmPass) {
      setAdminError('Les mots de passe ne correspondent pas');
      return;
    }
    const email = adminEmail.trim().toLowerCase();
    const pw = getPasswords();
    pw[email] = newPass;
    setPasswords(pw);
    setShowChangePass(false);
    setAdminError('Mot de passe modifié !');
    setTimeout(() => setAdminError(''), 2000);
  };
  const [activeTab, setActiveTab] = useState('home');

  // --- Admin state ---
  const allowedAdmins = ['admin@touch.ch','orga@touch.ch','timothee@touch.ch','contact@touch.ch'];
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem('adminEmail') || '');
  const [isAdmin, setIsAdmin]     = useState(localStorage.getItem('isAdmin') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const getPasswords = () => {
    try { return JSON.parse(localStorage.getItem('adminPasswords')) || {}; }
    catch { return {}; }
  };
  const setPasswords = (pw) => {
    localStorage.setItem('adminPasswords', JSON.stringify(pw));
  };


  return (
    <AdminContext.Provider value={isAdmin}>
      <ExcelProvider>
        <ResultatsProvider>
          <div
            style={{
              minHeight: '100vh',
              width: '100%',
              margin: 0,
              padding: 0,
              boxSizing: 'border-box',
              background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '0.97rem',
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflowX: 'hidden',
              paddingTop: 74, // Pour compenser la barre de menu fixe (hauteur du menu)
            }}
          >
            <div style={{ width: '100%', maxWidth: 1400, minWidth: 0 }}>
              <Menu activeTab={activeTab} setActiveTab={setActiveTab} onAdminClick={() => setShowLogin(true)} />
            </div>

            {/* Admin Panel en superposition */}
            {showLogin && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.32)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: 22,
                  boxShadow: '0 8px 24px #c0020a55',
                  padding: '36px 28px 28px 28px',
                  minWidth: 340,
                  maxWidth: '94vw',
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}>
                  <button onClick={() => setShowLogin(false)} style={{
                    position: 'absolute',
                    top: 18,
                    right: 22,
                    background: 'none',
                    border: 'none',
                    fontSize: 28,
                    color: '#c00',
                    cursor: 'pointer',
                    fontWeight: 700,
                    zIndex: 2,
                  }}>×</button>
                  <div style={{ width: '100%', maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
                    <AdminPanel
                      isAdmin={isAdmin}
                      adminEmail={adminEmail}
                      setAdminEmail={setAdminEmail}
                      setIsAdmin={setIsAdmin}
                      showLogin={showLogin}
                      setShowLogin={setShowLogin}
                      adminPass={adminPass}
                      setAdminPass={setAdminPass}
                      adminError={adminError}
                      setAdminError={setAdminError}
                      showChangePass={showChangePass}
                      setShowChangePass={setShowChangePass}
                      newPass={newPass}
                      setNewPass={setNewPass}
                      confirmPass={confirmPass}
                      setConfirmPass={setConfirmPass}
                      handleAdminLogin={handleAdminLogin}
                      handleLogout={handleLogout}
                      handleChangePass={handleChangePass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contenu des onglets, responsive et centré */}
            <div
              style={{
                width: '100%',
                maxWidth: 1400,
                minWidth: 0,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0 2vw',
                boxSizing: 'border-box',
              }}
            >
              {activeTab === 'home' && (
                <React.Suspense fallback={null}>
                  <Home setActiveTabFromHome={setActiveTab} />
                </React.Suspense>
              )}
              {activeTab === 'about' && <About />}
              {activeTab === 'swisscup' && (
                <SwissCup
                  isAdmin={isAdmin}
                  adminEmail={adminEmail}
                  showNationalsTab
                  // Synchronise l'onglet cible si demandé depuis Home
                  initialTab={localStorage.getItem('swisscup_target_tab') || undefined}
                  initialSubTab={localStorage.getItem('swisscup_target_subtab') || undefined}
                  onTabSync={() => {
                    localStorage.removeItem('swisscup_target_tab');
                    localStorage.removeItem('swisscup_target_subtab');
                  }}
                />
              )}
              {activeTab === 'club' && <Club />}
              {activeTab === 'matchs'     && <Calendar isAdmin={isAdmin} />}
              {activeTab === 'nationalteam' && <NationalTeam />}
              {activeTab === 'referees'  && <Referees isAdmin={isAdmin} />}
              {activeTab === 'photos'     && <Photos isAdmin={isAdmin} adminEmail={adminEmail} />}
            </div>
          </div>
        </ResultatsProvider>
      </ExcelProvider>
    </AdminContext.Provider>
  );
}

export default App;

