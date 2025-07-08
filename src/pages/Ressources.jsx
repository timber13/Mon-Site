
import React, { useState, useRef } from 'react';


export default function Ressources({ isAdmin = false }) {
  const [resources, setResources] = useState(() => {
    try {
      const data = localStorage.getItem('ressourcesList');
      return data ? JSON.parse(data) : [];
    } catch {
      localStorage.removeItem('ressourcesList');
      return [];
    }
  });
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  // Ajout d'un PDF
  const handleAddResource = (e) => {
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
    reader.onload = (ev) => {
      const newRes = { type: 'pdf', title: title || pdfFile.name, data: ev.target.result };
      const updated = [...resources, newRes];
      setResources(updated);
      localStorage.setItem('ressourcesList', JSON.stringify(updated));
      setTitle(''); setPdfFile(null); fileInputRef.current.value = '';
    };
    reader.readAsDataURL(pdfFile);
  };

  // Suppression d'une ressource
  const handleDelete = (idx) => {
    if (!window.confirm('Supprimer cette ressource ?')) return;
    const updated = resources.filter((_, i) => i !== idx);
    setResources(updated);
    localStorage.setItem('ressourcesList', JSON.stringify(updated));
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
  const handleEditSave = (idx) => {
    if (editPdfFile) {
      if (editPdfFile.size > 8 * 1024 * 1024) {
        setError('Le PDF est trop volumineux (max 8 Mo).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const updated = resources.map((res, i) =>
          i === idx ? { ...res, title: editTitle, data: ev.target.result } : res
        );
        setResources(updated);
        localStorage.setItem('ressourcesList', JSON.stringify(updated));
        setEditIdx(null);
        setEditTitle('');
        setEditPdfFile(null);
        if (editFileInputRef.current) editFileInputRef.current.value = '';
        setError('');
      };
      reader.readAsDataURL(editPdfFile);
    } else {
      const updated = resources.map((res, i) =>
        i === idx ? { ...res, title: editTitle } : res
      );
      setResources(updated);
      localStorage.setItem('ressourcesList', JSON.stringify(updated));
      setEditIdx(null);
      setEditTitle('');
      setEditPdfFile(null);
      setError('');
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
                <a href={res.data} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 16, color: '#007bff', textDecoration: 'underline', fontWeight: 500 }}>Voir PDF</a>
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
