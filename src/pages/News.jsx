
// Composant News : affichage placeholder pour la section news
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

// Composant News : permet de poster des actualités (comme Formation)
export default function News({ isAdmin = false }) {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('refereesNewsPosts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      localStorage.removeItem('refereesNewsPosts');
      return [];
    }
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

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title && !text && !link && !image) {
      setError('Veuillez remplir au moins un champ.');
      return;
    }
    // Insert post in Supabase
    const { error: supaError } = await supabase.from('news').insert([{ title, text, link, image }]);
    if (supaError) {
      setError('Erreur lors de l’ajout du post.');
      return;
    }
    setTitle('');
    setText('');
    setLink('');
    setImage('');
    setError('');
    fetchPosts();
  };

  async function fetchPosts() {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }
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
    fetchPosts();
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
  <h2 style={{ color: '#c00', textAlign: 'center', marginBottom: 20 }}>News</h2>
      {isAdmin && (
        <form onSubmit={handleAddPost} style={{ marginBottom: 30, background: '#f9f9f9', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <h3 style={{ marginTop: 0 }}>Add a post</h3>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <textarea
              placeholder="Text"
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', minHeight: 60 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              type="url"
              placeholder="Link (https://...)"
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
          <button type="submit" style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Publish</button>
        </form>
      )}
      {posts.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>No post published yet.</p>
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
                    placeholder="Title"
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    placeholder="Text"
                    style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', minHeight: 50 }}
                  />
                  <input
                    type="url"
                    value={editLink}
                    onChange={e => setEditLink(e.target.value)}
                    placeholder="Link (https://...)"
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
                    <button onClick={() => handleSaveEdit(idx)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Save</button>
                    <button onClick={handleCancelEdit} style={{ background: '#888', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* WordPress-style post layout */}
                  <article style={{
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #eee',
                    marginBottom: 24,
                    overflow: 'hidden',
                    border: '1px solid #eee',
                  }}>
                    {post.image && (
                      <div style={{ width: '100%', maxHeight: 260, overflow: 'hidden', background: '#f8f8f8' }}>
                        <img src={post.image} alt={post.title || 'visuel'} style={{ width: '100%', objectFit: 'cover', maxHeight: 260, display: 'block' }} />
                      </div>
                    )}
                    <div style={{ padding: 24 }}>
                      <header>
                        <h2 style={{ color: '#c00', fontSize: 22, margin: '0 0 10px 0', fontWeight: 700 }}>{post.title}</h2>
                      </header>
                      <section style={{ color: '#222', fontSize: 16, marginBottom: 10, whiteSpace: 'pre-line', lineHeight: 1.6 }}>{post.text}</section>
                      {post.link && (
                        <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 500, fontSize: 15 }}>
                          {post.link}
                        </a>
                      )}
                      {isAdmin && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                          <button onClick={() => handleEditPost(idx)} style={{ background: '#ffb300', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeletePost(idx)} style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </div>
                  </article>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
