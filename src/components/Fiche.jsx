import React, { useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

export default function Fiche({ match, onClose }) {
  const ficheRef = useRef();

  useEffect(() => {
    const style = document.createElement('style');
    style.media = 'print';
    style.innerHTML = `
      body * {
        visibility: hidden;
      }
      .printable, .printable * {
        visibility: visible;
      }
      .printable {
        position: absolute;
        top: 0;
        left: 0;
        background: white;
        padding: 20px;
        width: 100%;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleExportPDF = () => {
    const element = ficheRef.current;
    const opt = {
      margin: 0,
      filename: `Fiche_${match.team_1}_vs_${match.team_2}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const renderJoueurs = (joueurs) => (
    <table style={styles.joueurTable}>
      <thead>
        <tr>
          <th style={styles.joueurCell}>N°</th>
          <th style={styles.joueurCell}>Nom</th>
          <th style={styles.joueurCell}>Prénom</th>
        </tr>
      </thead>
      <tbody>
        {joueurs.map((j, i) => (
          <tr key={i}>
            <td style={styles.joueurCell}>{j.numero}</td>
            <td style={styles.joueurCell}>{j.nom}</td>
            <td style={styles.joueurCell}>{j.prenom}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (!match) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div className="printable" ref={ficheRef} style={styles.printable}>
          <div style={styles.redBarTop}></div>
          <div style={styles.header}>
            <h2 style={styles.title}>Fiche du Match</h2>
            <img
              src="https://i.imgur.com/zh3SwPw.png"
              alt="Touch Switzerland"
              style={styles.logo}
            />
          </div>

          <p><strong>Heure :</strong> {match.time}</p>
          <p><strong>Lieu :</strong> {match.lieu || 'Non précisé'}</p>
          {match.arbitres && (
            <p><strong>Arbitres :</strong> {match.arbitres}</p>
          )}

          <div style={{ marginBottom: 20 }}>
            <p><strong>Équipe 1 :</strong> {match.team_1}</p>
            {Array.isArray(match.joueurs_1) && renderJoueurs(match.joueurs_1)}
          </div>

          <div style={{ marginBottom: 20 }}>
            <p><strong>Équipe 2 :</strong> {match.team_2}</p>
            {Array.isArray(match.joueurs_2) && renderJoueurs(match.joueurs_2)}
          </div>
          <div style={styles.redBarBottom}></div>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={onClose}>Fermer</button>
          <button style={{ ...styles.button, backgroundColor: '#555' }} onClick={() => window.print()}>Imprimer</button>
          <button style={{ ...styles.button, backgroundColor: '#007bff' }} onClick={handleExportPDF}>Exporter en PDF</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
  },
  printable: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 60,
  },
  title: {
    marginTop: 0,
    color: '#c00',
  },
  redBarTop: {
    height: 12,
    backgroundColor: '#c00',
    marginBottom: 16,
  },
  redBarBottom: {
    height: 12,
    backgroundColor: '#c00',
    marginTop: 20,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#c00',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  joueurTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 5,
    marginBottom: 20,
  },
  joueurCell: {
    border: '1px solid #ccc',
    padding: '6px 8px',
    textAlign: 'left',
  }
};
