import React, { useState, useEffect } from 'react';

export default function Formation({ isAdmin = false }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('refereesFormationPosts');
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
    localStorage.setItem('refereesFormationPosts', JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = (e) => {
    e.preventDefault();
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
      <h2 style={{ color: '#c00', textAlign: 'center', marginBottom: 20 }}> Formations - Referees </h2>
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
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {posts.map((post, idx) => (
              <div
                key={idx}
                style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 18, position: 'relative', cursor: editIdx === idx ? 'default' : 'pointer' }}
                onClick={() => editIdx === idx ? undefined : setSelectedPost(post)}
              >
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
                      <img src={editImage} alt="aperçu" style={{ maxWidth: '100%', maxHeight: 120, marginBottom: 8, borderRadius: 6 }} />
                    )}
                    {editError && <div style={{ color: '#c00', marginBottom: 8 }}>{editError}</div>}
                    <button onClick={() => handleSaveEdit(idx)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer', marginRight: 8 }}>Enregistrer</button>
                    <button onClick={handleCancelEdit} style={{ background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Annuler</button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ color: '#c00', marginTop: 0 }}>{post.title}</h3>
                    {post.image && (
                      <img src={post.image} alt="Formation visuel" style={{ maxWidth: '100%', maxHeight: 220, display: 'block', margin: '10px auto 16px auto', borderRadius: 8, objectFit: 'cover' }} />
                    )}
                    <pre style={{ marginBottom: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}>{post.text}</pre>
                    <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>Voir la ressource</a>
                    {isAdmin && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); handleEditPost(idx); }}
                          style={{ position: 'absolute', top: 16, right: 100, background: '#fff', color: '#007bff', border: '1px solid #007bff', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold', marginRight: 16 }}
                          title="Modifier ce post"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeletePost(idx); }}
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
          {/* Overlay post en grand */}
          {selectedPost && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.38)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 8px 32px #c0020a55',
                padding: 48,
                minWidth: 420,
                maxWidth: 900,
                width: '96vw',
                maxHeight: '92vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <button
                  onClick={() => setSelectedPost(null)}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#c00',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    fontWeight: 900,
                    fontSize: 26,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #c0020a22',
                    zIndex: 10,
                    lineHeight: 1,
                  }}
                  title="Fermer"
                >×</button>
                {selectedPost.image && <img src={selectedPost.image} alt={selectedPost.title || 'post'} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '2.5px solid #c00', background: '#fff', marginBottom: 18 }} />}
                <div style={{ fontWeight: 700, color: '#c00', fontSize: 26, marginBottom: 10, textAlign: 'center' }}>{selectedPost.title || <span style={{ color: '#aaa' }}>[Sans titre]</span>}</div>
                {selectedPost.text && <div style={{ color: '#222', fontSize: 18, marginBottom: 10, textAlign: 'center', whiteSpace: 'pre-line' }}>{selectedPost.text}</div>}
                {selectedPost.link && <a href={selectedPost.link} target="_blank" rel="noopener noreferrer" style={{ color: '#c00', fontSize: 17, textDecoration: 'underline', marginBottom: 8, display: 'block' }}>Lien</a>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
