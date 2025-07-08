
// Fiche : composant d'affichage de la fiche de match avec export PDF
import React, { useRef, useEffect, useContext } from 'react';
import html2pdf from 'html2pdf.js';
import { ResultatsContext } from '../contexts/ResultatsContext';


// Composant principal de la fiche de match
export default function Fiche({ match, onClose }) {
  // Référence pour l'impression/export PDF
  const ficheRef = useRef();
  // Accès au contexte global des résultats (toutes les tables de matchs)
  const { tables } = useContext(ResultatsContext);

  // Ajoute un style spécial pour l'impression PDF (cache tout sauf la fiche)
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

  // Fonction pour exporter la fiche en PDF
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

  // (Non utilisé dans l'affichage direct, mais exemple de calcul global des essais par joueur)
  // const scorerCounts = React.useMemo(() => {
  //   ...
  // }, [tables]);

  // Affiche le tableau des joueurs d'une équipe avec le nombre d'essais marqués dans CE match
  const renderJoueurs = (joueurs, team) => (
    <table style={{ ...styles.joueurTable, width: '80%', fontSize: '1em', margin: '8px auto 16px auto' }}>
      <thead>
        <tr>
          <th style={{ ...styles.joueurCell, padding: '6px 8px', fontSize: '1em' }}>N°</th>
          <th style={{ ...styles.joueurCell, padding: '6px 8px', fontSize: '1em' }}>Nom</th>
          <th style={{ ...styles.joueurCell, padding: '6px 8px', fontSize: '1em' }}>Prénom</th>
          <th style={{ ...styles.joueurCell, padding: '6px 8px', fontSize: '1em' }}>Essais</th>
        </tr>
      </thead>
      <tbody>
        {joueurs.map((j, i) => {
          // Le numéro de la colonne C doit être utilisé pour le décompte des essais
          // On suppose que j.numero_c correspond à la colonne C (numéro d'essai)
          let essais = 0;
          const joueurNum = j.numero_c !== undefined && j.numero_c !== null && j.numero_c !== ''
            ? String(j.numero_c).trim()
            : String(j.numero).trim();
          let scorers = [];
          if (team === match.team_1 && Array.isArray(match.scorers_1)) {
            scorers = match.scorers_1;
          } else if (team === match.team_2 && Array.isArray(match.scorers_2)) {
            scorers = match.scorers_2;
          }
          essais = scorers.filter(num => String(num).trim() === joueurNum).length;
          return (
            <tr key={i}>
              <td style={{ ...styles.joueurCell, padding: '6px 8px' }}>{j.numero}</td>
              <td style={{ ...styles.joueurCell, padding: '6px 8px' }}>{j.nom}</td>
              <td style={{ ...styles.joueurCell, padding: '6px 8px' }}>{j.prenom}</td>
              <td style={{ ...styles.joueurCell, padding: '6px 8px' }}>{essais > 0 ? essais : ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );


  // Si pas de match sélectionné, on n'affiche rien
  if (!match) return null;

  // Rendu principal de la fiche de match
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Zone imprimable/exportable */}
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

          {/* Score et infos principales */}
          {typeof match.score_1 !== 'undefined' && typeof match.score_2 !== 'undefined' && (
            <p><strong>Score :</strong> {match.team_1} {match.score_1} - {match.score_2} {match.team_2}</p>
          )}
          <p><strong>Heure :</strong> {match.time}</p>
          <p><strong>Lieu :</strong> {match.lieu || 'Non précisé'}</p>
          {match.arbitres && (
            <p><strong>Arbitres :</strong> {match.arbitres}</p>
          )}

          {/* Listes des joueurs des deux équipes */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 6 }}>
                {match.team_1}
              </p>
              {Array.isArray(match.joueurs_1) && renderJoueurs(match.joueurs_1, match.team_1)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 6 }}>
                {match.team_2}
              </p>
              {Array.isArray(match.joueurs_2) && renderJoueurs(match.joueurs_2, match.team_2)}
            </div>
          </div>
          <div style={styles.redBarBottom}></div>
        </div>

        {/* Boutons d'action */}
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
