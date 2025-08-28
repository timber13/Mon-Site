import { supabase } from '../../supabase/client';
import React, { useState, useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';

export default function AboutConstitution() {
  const handleDeletePdf = async () => {
    setPdfUrl('/pdfs/constitution.pdf');
    await supabase.from('constitution').upsert({ id: 1, pdfUrl: '/pdfs/constitution.pdf' });
  };

  const isAdmin = useContext(AdminContext);
  const [editing, setEditing] = useState(false);

  // Récupère les valeurs depuis localStorage ou valeurs par défaut
  const [pdfUrl, setPdfUrl] = useState('/pdfs/constitution.pdf');
  const [pdfLabel, setPdfLabel] = useState('Télécharger la Constitution (PDF)');
  const [sideText, setSideText] = useState('Consultez le document officiel de la constitution de Touch Switzerland.');
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    async function fetchConstitution() {
      const { data } = await supabase.from('constitution').select('*').single();
      setPdfUrl(data?.pdfUrl || '/pdfs/constitution.pdf');
      setPdfLabel(data?.pdfLabel || 'Télécharger la Constitution (PDF)');
      setSideText(data?.sideText || 'Consultez le document officiel de la constitution de Touch Switzerland.');
      setLoading(false);
    }
    fetchConstitution();
  }, []);

  const handleSave = () => {
    async function saveConstitution() {
      await supabase.from('constitution').upsert({ id: 1, pdfUrl, pdfLabel, sideText });
      setEditing(false);
    }
    saveConstitution();
  };

  // Upload PDF
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(ev) {
      setPdfUrl('data:application/pdf;base64,' + ev.target.result.split(',')[1]);
      await supabase.from('constitution').upsert({ id: 1, pdfUrl: 'data:application/pdf;base64,' + ev.target.result.split(',')[1] });
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = () => {
    React.useEffect(() => {
      async function fetchConstitution() {
        const { data } = await supabase.from('constitution').select('*').single();
        setPdfUrl(data?.pdfUrl || '/pdfs/constitution.pdf');
        setPdfLabel(data?.pdfLabel || 'Télécharger la Constitution (PDF)');
        setSideText(data?.sideText || 'Consultez le document officiel de la constitution de Touch Switzerland.');
      }
      fetchConstitution();
    }, []);
    setEditing(false);
  };

  return (
    <div>
      <h2 style={{ color: '#c00' }}>Constitution</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
        {isAdmin && editing ? (
          <>
            <input
              type="text"
              value={pdfUrl}
              onChange={e => setPdfUrl(e.target.value)}
              placeholder="URL du PDF"
              style={{ marginRight: 12, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #c00', width: 220 }}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              style={{ marginRight: 12 }}
            />
            <button onClick={handleDeletePdf} style={{ marginRight: 12, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Supprimer PDF</button>
            <input
              type="text"
              value={pdfLabel}
              onChange={e => setPdfLabel(e.target.value)}
              placeholder="Texte du lien"
              style={{ marginRight: 12, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #c00', width: 220 }}
            />
            <input
              type="text"
              value={sideText}
              onChange={e => setSideText(e.target.value)}
              placeholder="Texte à droite"
              style={{ marginRight: 12, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #888', width: 320 }}
            />
            <button onClick={handleSave} style={{ marginRight: 8, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save</button>
            <button onClick={handleCancel} style={{ fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          </>
        ) : (
          <>
            {pdfUrl.startsWith('data:application/pdf;base64,') ? (
              <button
                onClick={() => {
                  // Ouvre le PDF base64 dans un nouvel onglet via Blob
                  const base64 = pdfUrl.split(',')[1];
                  const byteCharacters = atob(base64);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: 'application/pdf' });
                  const blobUrl = URL.createObjectURL(blob);
                  window.open(blobUrl, '_blank');
                }}
                style={{ color: '#c00', fontWeight: 700, fontSize: 20, textDecoration: 'underline', marginRight: 18, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {pdfLabel}
              </button>
            ) : (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#c00', fontWeight: 700, fontSize: 20, textDecoration: 'underline', marginRight: 18 }}
              >
                {pdfLabel}
              </a>
            )}
            <span style={{ color: '#888', fontSize: 18 }}>
              {sideText}
            </span>
            {isAdmin && (
              <button onClick={() => setEditing(true)} style={{ marginLeft: 18, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Edit</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
