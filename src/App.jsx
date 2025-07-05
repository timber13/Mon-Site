// src/App.jsx

import React, { useState, useEffect } from 'react';
import Resultats from './pages/Resultats';
import Classement from './pages/Classement';
import Scorers from './pages/Scorers';
import Matchs from './pages/Matchs';
import Formation from './pages/Formation';
import Photos from './pages/Photos';
import AdminPanel from './components/Admin';
import { ExcelProvider } from './contexts/ExcelContext';
import { ResultatsProvider } from './contexts/ResultatsContext';

function App() {
  const [activeTab, setActiveTab] = useState('resultats');

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

  // Initialisation mot de passe par défaut
  useEffect(() => {
    const pw = getPasswords();
    let updated = false;
    allowedAdmins.forEach(email => {
      if (!pw[email]) { pw[email] = 'touch2025'; updated = true; }
    });
    if (updated) setPasswords(pw);
  }, []);

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

  // Style simple pour les onglets
  const tabStyle = (tab) => ({
    padding: '8px 16px',
    marginRight: 8,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#c00' : '#eee',
    color: activeTab === tab ? '#fff' : '#000'
  });

  return (
    <ExcelProvider>
      <ResultatsProvider>
        <div style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif', position: 'relative' }}>
          
          {/* Admin Panel */}
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

          {/* Navigation */}
          <nav style={{ marginBottom: 20 }}>
            <button style={tabStyle('resultats')}    onClick={() => setActiveTab('resultats')}>Résultats</button>
            <button style={tabStyle('classement')}   onClick={() => setActiveTab('classement')}>Classement</button>
            {/* Onglet TopScorers supprimé de la navigation principale */}
            <button style={tabStyle('matchs')}       onClick={() => setActiveTab('matchs')}>Matchs</button>
            <button style={tabStyle('formation')}    onClick={() => setActiveTab('formation')}>Formations</button>
            <button style={tabStyle('photos')}       onClick={() => setActiveTab('photos')}>Photos</button>
          </nav>

          {/* Contenu des onglets */}
          {activeTab === 'resultats'  && <Resultats isAdmin={isAdmin} adminEmail={adminEmail} />}
          {activeTab === 'classement' && <Classement />}
          {/* Affichage TopScorers supprimé de la navigation principale */}
          {activeTab === 'matchs'     && <Matchs />}
          {activeTab === 'formation'  && <Formation isAdmin={isAdmin} />}
          {activeTab === 'photos'     && <Photos isAdmin={isAdmin} adminEmail={adminEmail} />}
        </div>
      </ResultatsProvider>
    </ExcelProvider>
  );
}

export default App;

