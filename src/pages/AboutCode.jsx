
import { supabase } from '../../supabase/client';
import React, { useState, useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import { supabase } from '../../supabase/client';

export default function AboutCode() {
  const isAdmin = useContext(AdminContext);
  const [editing, setEditing] = useState(false);

  const [pdfUrl, setPdfUrl] = useState('/pdfs/code_of_conduct.pdf');
  const [pdfLabel, setPdfLabel] = useState('Télécharger le Code of Conduct (PDF)');
  const [sideText, setSideText] = useState('Consultez le document officiel du Code of Conduct.');
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    async function fetchCode() {
      const { data } = await supabase.from('code_of_conduct').select('*').single();
      setPdfUrl(data?.pdfUrl || '/pdfs/code_of_conduct.pdf');
      setPdfLabel(data?.pdfLabel || 'Télécharger le Code of Conduct (PDF)');
      setSideText(data?.sideText || 'Consultez le document officiel du Code of Conduct.');
      setLoading(false);
    }
    fetchCode();
  }, []);

  const handleSave = () => {
    async function saveCode() {
      await supabase.from('code_of_conduct').upsert({ id: 1, pdfUrl, pdfLabel, sideText });
      setEditing(false);
    }
    saveCode();
  };
  const handleCancel = () => {
    React.useEffect(() => {
      async function fetchCode() {
        const { data } = await supabase.from('code_of_conduct').select('*').single();
        setPdfUrl(data?.pdfUrl || '/pdfs/code_of_conduct.pdf');
        setPdfLabel(data?.pdfLabel || 'Télécharger le Code of Conduct (PDF)');
        setSideText(data?.sideText || 'Consultez le document officiel du Code of Conduct.');
      }
      fetchCode();
    }, []);
    setEditing(false);
  };
  // Upload PDF
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(ev) {
      setPdfUrl('data:application/pdf;base64,' + ev.target.result.split(',')[1]);
      await supabase.from('code_of_conduct').upsert({ id: 1, pdfUrl: 'data:application/pdf;base64,' + ev.target.result.split(',')[1] });
    };
    reader.readAsDataURL(file);
  };
  // Supprimer le PDF uploadé
  const handleDeletePdf = async () => {
    setPdfUrl('/pdfs/code_of_conduct.pdf');
    await supabase.from('code_of_conduct').upsert({ id: 1, pdfUrl: '/pdfs/code_of_conduct.pdf' });
  };

  return (
    <div>
      <h2 style={{ color: '#c00' }}>Code of Conduct</h2>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
        {isAdmin && editing ? (
          <>
            <input
              type="text"
              value={pdfUrl}
              onChange={e => setPdfUrl(e.target.value)}
              placeholder="URL du PDF"
              style={{ marginBottom: 8, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #c00', width: 220 }}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              style={{ marginBottom: 8 }}
            />
            <button onClick={handleDeletePdf} style={{ marginBottom: 8, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Supprimer PDF</button>
            <input
              type="text"
              value={pdfLabel}
              onChange={e => setPdfLabel(e.target.value)}
              placeholder="Texte du lien"
              style={{ marginBottom: 8, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #c00', width: 220 }}
            />
            <input
              type="text"
              value={sideText}
              onChange={e => setSideText(e.target.value)}
              placeholder="Texte au-dessus du lien"
              style={{ marginBottom: 8, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #888', width: 320 }}
            />
            <button onClick={handleSave} style={{ marginRight: 8, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save</button>
            <button onClick={handleCancel} style={{ fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          </>
        ) : (
          <>
            <span style={{ color: '#888', fontSize: 18, marginBottom: 6 }}>
              {sideText}
            </span>
            {pdfUrl.startsWith('data:application/pdf;base64,') ? (
              <button
                onClick={() => {
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
            {isAdmin && (
              <button onClick={() => setEditing(true)} style={{ marginLeft: 18, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Edit</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
