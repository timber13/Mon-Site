
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {!isAdmin && showLogin && (
        <form style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }} onSubmit={e => { e.preventDefault(); handleAdminLogin(); }}>
          <h2 style={{ color: '#c00', fontWeight: 700, marginBottom: 8, fontSize: 26, letterSpacing: 1 }}>Connexion admin</h2>
          <input
            type="email"
            placeholder="Adresse email admin"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', width: '100%', fontSize: 16, marginBottom: 4 }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', width: '100%', fontSize: 16, marginBottom: 4 }}
          />
          {adminError && <div style={{ color: '#c00', marginBottom: 8, fontWeight: 500 }}>{adminError}</div>}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 12, marginTop: 6 }}>
            <button type="submit" style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', letterSpacing: 1 }}>Valider</button>
            <button type="button" style={{ background: '#888', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => { setShowLogin(false); setAdminError(''); }}>Annuler</button>
          </div>
        </form>
      )}
      {isAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <span style={{ color: '#c00', fontWeight: 'bold', marginBottom: 10, fontSize: 18 }}>{adminEmail}</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ background: '#888', color: 'white', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }} onClick={handleLogout}>Déconnexion</button>
            <button style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }} onClick={() => setShowChangePass(true)}>Changer mot de passe</button>
          </div>
        </div>
      )}
      {showChangePass && (
        <form style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 18 }} onSubmit={e => { e.preventDefault(); handleChangePass(); }}>
          <h2 style={{ color: '#007bff', fontWeight: 700, marginBottom: 8, fontSize: 22, letterSpacing: 1 }}>Changer le mot de passe</h2>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', width: '100%', fontSize: 16, marginBottom: 4 }}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', width: '100%', fontSize: 16, marginBottom: 4 }}
          />
          {adminError && <div style={{ color: '#c00', marginBottom: 8, fontWeight: 500 }}>{adminError}</div>}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 12, marginTop: 6 }}>
            <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', letterSpacing: 1 }}>Valider</button>
            <button type="button" style={{ background: '#888', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => { setShowChangePass(false); setAdminError(''); setNewPass(''); setConfirmPass(''); }}>Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
}
