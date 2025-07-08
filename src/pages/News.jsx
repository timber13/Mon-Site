
// Composant News : affichage placeholder pour la section news
import React, { useState, useEffect } from 'react';

// Composant News : permet de poster des actualités (comme Formation)
export default function News({ isAdmin = false }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('refereesNewsPosts');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  // Pour l'édition
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    localStorage.setItem('refereesNewsPosts', JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!title && !text && !link && !image) {
      setError('Veuillez remplir au moins un champ.');
      return;
    }
    setPosts([{ title, text, link, image }, ...posts]);
    setTitle('');
    setText('');
    setLink('');
    setImage('');
    setError('');
  };

  // Gestion upload image (ajout)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Gestion upload image (édition)
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePost = (idxToDelete) => {
    if (window.confirm('Supprimer ce post ?')) {
      setPosts(posts => posts.filter((_, idx) => idx !== idxToDelete));
    }
  };

  const handleEditPost = (idx) => {
    setEditIdx(idx);
    setEditTitle(posts[idx].title);
    setEditText(posts[idx].text);
    setEditLink(posts[idx].link);
    setEditImage(posts[idx].image || '');
    setEditError('');
  };

  const handleSaveEdit = (idx) => {
    setPosts(posts => posts.map((post, i) => i === idx ? { title: editTitle, text: editText, link: editLink, image: editImage } : post));
    setEditIdx(null);
    setEditTitle('');
    setEditText('');
    setEditLink('');
    setEditImage('');
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditTitle('');
    setEditText('');
    setEditLink('');
    setEditImage('');
    setEditError('');
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2 style={{ color: '#c00', textAlign: 'center', marginBottom: 20 }}> News </h2>
      {isAdmin && (
        <form onSubmit={handleAddPost} style={{ marginBottom: 30, background: '#f9f9f9', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <h3 style={{ marginTop: 0 }}>Ajouter un post</h3>
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
          <div style={{ marginBottom: 10 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            {image && (
              <img src={image} alt="aperçu" style={{ maxWidth: '100%', maxHeight: 120, marginTop: 8, borderRadius: 6 }} />
            )}
          </div>
          {error && <div style={{ color: '#c00', marginBottom: 8 }}>{error}</div>}
          <button type="submit" style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Publier</button>
        </form>
      )}
      {posts.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>Aucun post publié pour l’instant.</p>
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  {editImage && (
                    <img src={editImage} alt="aperçu" style={{ maxWidth: '100%', maxHeight: 120, marginTop: 8, borderRadius: 6 }} />
                  )}
                  {editError && <div style={{ color: '#c00', marginBottom: 8 }}>{editError}</div>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => handleSaveEdit(idx)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Enregistrer</button>
                    <button onClick={handleCancelEdit} style={{ background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#c00', fontSize: 18 }}>{post.title}</div>
                      <div style={{ color: '#333', fontSize: 15, margin: '6px 0 0 0', whiteSpace: 'pre-line' }}>{post.text}</div>
                      {post.link && (
                        <div style={{ marginTop: 6 }}>
                          <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 500 }}>
                            {post.link}
                          </a>
                        </div>
                      )}
                    </div>
                    {post.image && (
                      <img src={post.image} alt="aperçu" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 6, marginLeft: 12 }} />
                    )}
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={() => handleEditPost(idx)} style={{ background: '#ffb300', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Modifier</button>
                      <button onClick={() => handleDeletePost(idx)} style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Supprimer</button>
                    </div>
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
