
import React, { useState, useRef } from 'react';
import { supabase } from '../supabase/client';


export default function Ressources({ isAdmin = false }) {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  // Ajout d'un PDF
  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    const { data } = await supabase.from('ressources').select('*').order('created_at', { ascending: false });
    setResources(data || []);
  }

  const handleAddResource = async (e) => {
    e.preventDefault();
    setError('');
    if (!pdfFile) {
      setError('Ajoutez un PDF.');
      return;
    }
    if (pdfFile.size > 8 * 1024 * 1024) {
      setError('Le PDF est trop volumineux (max 8 Mo).');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const newRes = { type: 'pdf', title: title || pdfFile.name, data: ev.target.result };
      await supabase.from('ressources').insert([newRes]);
      setTitle(''); setPdfFile(null); fileInputRef.current.value = '';
      fetchResources();
    };
    reader.readAsDataURL(pdfFile);
  };

  // Suppression d'une ressource
  const handleDelete = async (idx) => {
    if (!window.confirm('Supprimer cette ressource ?')) return;
    const res = resources[idx];
    await supabase.from('ressources').delete().eq('id', res.id);
    fetchResources();
  };

  // Modification d'une ressource (titre)
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPdfFile, setEditPdfFile] = useState(null);
  const editFileInputRef = useRef();
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditTitle(resources[idx].title);
    setEditPdfFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };
  const handleEditSave = async (idx) => {
    const res = resources[idx];
    if (editPdfFile) {
      if (editPdfFile.size > 8 * 1024 * 1024) {
        setError('Le PDF est trop volumineux (max 8 Mo).');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        await supabase.from('ressources').update({ title: editTitle, data: ev.target.result }).eq('id', res.id);
        setEditIdx(null);
        setEditTitle('');
        setEditPdfFile(null);
        if (editFileInputRef.current) editFileInputRef.current.value = '';
        setError('');
        fetchResources();
      };
      reader.readAsDataURL(editPdfFile);
    } else {
      await supabase.from('ressources').update({ title: editTitle }).eq('id', res.id);
      setEditIdx(null);
      setEditTitle('');
      setEditPdfFile(null);
      setError('');
      fetchResources();
    }
  };
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditTitle('');
    setEditPdfFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setError('');
  };

  // Style principal du bloc ressources
  const style = {
    background: 'rgba(255,255,255,0.98)',
    borderRadius: 16,
    boxShadow: '0 2px 16px #c0020a',
    padding: '40px 32px',
    minHeight: 220,
    border: '1.5px solid #f8d7da',
    margin: '0 auto',
    maxWidth: 700,
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
    color: '#c00',
    fontWeight: 600,
    fontSize: '1.1rem',
    letterSpacing: '0.04em',
  };

  return (
    <div style={style}>
      <h2 style={{ color: '#c00', fontWeight: 700, fontSize: 26, marginBottom: 18, letterSpacing: 1 }}>Ressources</h2>
      {isAdmin && (
        <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, background: '#fff8', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #c0020a22' }}>
          <input type="text" placeholder="Titre (optionnel)" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }} />
          <input type="file" accept="application/pdf" ref={fileInputRef} onChange={e => setPdfFile(e.target.files[0])} style={{ flex: 1 }} />
          {error && <div style={{ color: '#c00', fontWeight: 500, marginBottom: 4 }}>{error}</div>}
          <button type="submit" style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', alignSelf: 'flex-start' }}>Publier</button>
        </form>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {resources.length === 0 && <li style={{ color: '#888', fontWeight: 400 }}>Aucune ressource publiée pour le moment.</li>}
        {resources.map((res, idx) => (
          <li key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px #c0020a22', marginBottom: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              {editIdx === idx ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    style={{ fontWeight: 700, color: '#c00', fontSize: 17, border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 80 }}
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={editFileInputRef}
                    onChange={e => setEditPdfFile(e.target.files[0])}
                    style={{ marginLeft: 8 }}
                  />
                  <button onClick={() => handleEditSave(idx)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', marginLeft: 4 }}>Enregistrer</button>
                  <button onClick={handleEditCancel} style={{ background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', marginLeft: 4 }}>Annuler</button>
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 700, color: '#c00', fontSize: 17 }}>{res.title}</span>
                </>
              )}
              {res.type === 'pdf' && (
                res.data.startsWith('data:application/pdf;base64,') ? (
                  <button
                    onClick={() => {
                      const base64 = res.data.split(',')[1];
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
                    style={{ marginLeft: 16, color: '#007bff', textDecoration: 'underline', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Voir PDF
                  </button>
                ) : (
                  <a href={res.data} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 16, color: '#007bff', textDecoration: 'underline', fontWeight: 500 }}>Voir PDF</a>
                )
              )}
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(idx)} style={{ background: '#ffb300', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Modifier</button>
                <button onClick={() => handleDelete(idx)} style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Supprimer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
