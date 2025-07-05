
import React, { useState } from 'react';

export default function AdminPanel({
  isAdmin,
  adminEmail,
  setAdminEmail,
  setIsAdmin,
  showLogin,
  setShowLogin,
  adminPass,
  setAdminPass,
  adminError,
  setAdminError,
  showChangePass,
  setShowChangePass,
  newPass,
  setNewPass,
  confirmPass,
  setConfirmPass,
  handleAdminLogin,
  handleLogout,
  handleChangePass
}) {
  return (
    <div style={{ position: 'absolute', top: 20, right: 30, zIndex: 10 }}>
      {!isAdmin && (
        <button style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setShowLogin(true)}>Connexion admin</button>
      )}
      {isAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: '#c00', fontWeight: 'bold', marginBottom: 6 }}>{adminEmail}</span>
          <div>
            <button style={{ background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', marginRight: 8 }} onClick={handleLogout}>Déconnexion admin</button>
            <button style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setShowChangePass(true)}>Changer mot de passe</button>
          </div>
        </div>
      )}
      {showLogin && (
        <div style={{ position: 'fixed', top: 30, right: 30, background: '#fff0f0', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px #c00', zIndex: 100 }}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="email"
              placeholder="Adresse email admin"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              style={{ marginRight: 10, padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={adminPass}
              onChange={e => setAdminPass(e.target.value)}
              style={{ marginRight: 10, padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
            />
          </div>
          {adminError && <div style={{ color: '#c00', marginBottom: 8 }}>{adminError}</div>}
          <button style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleAdminLogin}>Valider</button>
          <button style={{ marginLeft: 8, background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowLogin(false); setAdminError(''); }}>Annuler</button>
        </div>
      )}
      {showChangePass && (
        <div style={{ position: 'fixed', top: 90, right: 30, background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px #007bff', zIndex: 100 }}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              style={{ marginRight: 10, padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              style={{ marginRight: 10, padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
            />
          </div>
          {adminError && <div style={{ color: '#c00', marginBottom: 8 }}>{adminError}</div>}
          <button style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleChangePass}>Valider</button>
          <button style={{ marginLeft: 8, background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setShowChangePass(false); setAdminError(''); setNewPass(''); setConfirmPass(''); }}>Annuler</button>
        </div>
      )}
    </div>
  );
}
