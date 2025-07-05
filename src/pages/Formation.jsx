
import React, { useState, useEffect } from 'react';

export default function Formation({ isAdmin }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('formationPosts');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  // Pour l'édition
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    localStorage.setItem('formationPosts', JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim() || !link.trim()) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setPosts([{ title, text, link }, ...posts]);
    setTitle('');
    setText('');
    setLink('');
    setError('');
  };

  // Fonction pour supprimer un post par son index
  const handleDeletePost = (idxToDelete) => {
    if (window.confirm('Supprimer ce post ?')) {
      setPosts(posts => posts.filter((_, idx) => idx !== idxToDelete));
    }
  };

  // Fonction pour lancer l'édition d'un post
  const handleEditPost = (idx) => {
    setEditIdx(idx);
    setEditTitle(posts[idx].title);
    setEditText(posts[idx].text);
    setEditLink(posts[idx].link);
    setEditError('');
  };

  // Fonction pour valider la modification
  const handleSaveEdit = (idx) => {
    if (!editTitle.trim() || !editText.trim() || !editLink.trim()) {
      setEditError('Tous les champs sont obligatoires.');
      return;
    }
    setPosts(posts => posts.map((post, i) => i === idx ? { title: editTitle, text: editText, link: editLink } : post));
    setEditIdx(null);
    setEditTitle('');
    setEditText('');
    setEditLink('');
    setEditError('');
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditTitle('');
    setEditText('');
    setEditLink('');
    setEditError('');
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      
      <h2 style={{ color: '#c00', textAlign: 'center', marginBottom: 20 }}> Les prochaines Formations</h2>
      {isAdmin && (
        <form onSubmit={handleAddPost} style={{ marginBottom: 30, background: '#f9f9f9', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <h3 style={{ marginTop: 0 }}>Ajouter une formation</h3>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <textarea
              placeholder="Texte"
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', minHeight: 60 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              type="url"
              placeholder="Lien (https://...)"
              value={link}
              onChange={e => setLink(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          {error && <div style={{ color: '#c00', marginBottom: 8 }}>{error}</div>}
          <button type="submit" style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Publier</button>
        </form>
      )}
      {posts.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>Aucune formation publiée pour l’instant.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {posts.map((post, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 18, position: 'relative' }}>
              {editIdx === idx ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Titre"
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    placeholder="Texte"
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', minHeight: 50 }}
                  />
                  <input
                    type="url"
                    value={editLink}
                    onChange={e => setEditLink(e.target.value)}
                    placeholder="Lien (https://...)"
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  {editError && <div style={{ color: '#c00', marginBottom: 8 }}>{editError}</div>}
                  <button onClick={() => handleSaveEdit(idx)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer', marginRight: 8 }}>Enregistrer</button>
                  <button onClick={handleCancelEdit} style={{ background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Annuler</button>
                </div>
              ) : (
                <>
                  <h3 style={{ color: '#c00', marginTop: 0 }}>{post.title}</h3>
                  <pre style={{ marginBottom: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}>{post.text}</pre>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>Voir la ressource</a>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditPost(idx)}
                        style={{ position: 'absolute', top: 16, right: 100, background: '#fff', color: '#007bff', border: '1px solid #007bff', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold', marginRight: 16 }}
                        title="Modifier ce post"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeletePost(idx)}
                        style={{ position: 'absolute', top: 16, right: 16, background: '#fff', color: '#c00', border: '1px solid #c00', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                        title="Supprimer ce post"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}