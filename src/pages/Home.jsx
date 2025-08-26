
import React, { useState, useEffect } from 'react';
import ClassementNationals from './Classement_Nationals';
import ClassementRegionalWest from './Classement_Regional_West';
import ClassementRegionalEast from './Classement_Regional_East';

function getAllPosts() {
  // Retrieves and merges Formation and News posts, sorted by creation date (if available)
  const formation = JSON.parse(localStorage.getItem('refereesFormationPosts') || '[]');
  const news = JSON.parse(localStorage.getItem('refereesNewsPosts') || '[]');
  // Add a source to differentiate
  const fPosts = formation.map(p => ({ ...p, _source: 'Formation' }));
  const nPosts = news.map(p => ({ ...p, _source: 'News' }));
  // No date, so we take the order of addition (most recent first)
  return [...fPosts, ...nPosts];
}



export default function Home({ setActiveTabFromHome }) {
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', text: '', link: '', image: '', source: 'News' });
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [posts, setPosts] = useState(getAllPosts());
  const [selectedPost, setSelectedPost] = useState(null);

  // Classement state
  const [classementTab, setClassementTab] = useState(0); // 0: Nationals, 1: West, 2: East
  const [tablesNationals, setTablesNationals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resultatsData_nationals')) || [];
    } catch {
      return [];
    }
  });
  const [tablesWest, setTablesWest] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resultatsData_regionalWest')) || [];
    } catch {
      return [];
    }
  });
  const [tablesEast, setTablesEast] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resultatsData_regionalEast')) || [];
    } catch {
      return [];
    }
  });

  // Sync rankings if localStorage changes (other tab)
  useEffect(() => {
    const sync = () => {
      setPosts(getAllPosts());
      try {
        setTablesNationals(JSON.parse(localStorage.getItem('resultatsData_nationals')) || []);
        setTablesWest(JSON.parse(localStorage.getItem('resultatsData_regionalWest')) || []);
        setTablesEast(JSON.parse(localStorage.getItem('resultatsData_regionalEast')) || []);
      } catch {}
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Force refresh if returning to the page
  useEffect(() => {
    setPosts(getAllPosts());
    try {
      setTablesNationals(JSON.parse(localStorage.getItem('resultatsData_nationals')) || []);
      setTablesWest(JSON.parse(localStorage.getItem('resultatsData_regionalWest')) || []);
      setTablesEast(JSON.parse(localStorage.getItem('resultatsData_regionalEast')) || []);
    } catch {}
  }, []);


  // Ranking block on the left with arrows
  const classementTabs = [
    { label: 'Nationals', component: <ClassementNationals tablesNationals={tablesNationals} /> },
    { label: 'Regional West', component: <ClassementRegionalWest tablesWest={tablesWest} /> },
    { label: 'Regional East', component: <ClassementRegionalEast tablesEast={tablesEast} /> },
  ];


  // Arrow management
  const handlePrev = () => setClassementTab((prev) => (prev === 0 ? 2 : prev - 1));
  const handleNext = () => setClassementTab((prev) => (prev === 2 ? 0 : prev + 1));

  // Auto change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setClassementTab((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Video Banner Start */}
      <div style={{ width: '100vw', display: 'flex', justifyContent: 'center', margin: '0', padding: '0', position: 'relative' }}>
        <video
          src="https://touchswitzerland.ch/website/wp-content/uploads/2024/04/intro.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100vw', height: '25vw', borderRadius: '0', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', minWidth: '100vw', maxWidth: '100vw', objectFit: 'cover' }}
        >
          Your browser does not support the video tag.
        </video>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          width: '100vw',
          background: 'rgba(218, 12, 12, 0.92)',
          color: '#fff',
          padding: '18px 0',
          fontSize: '2.2vw',
          fontWeight: 800,
          letterSpacing: '0.08em',
          boxShadow: '0 2px 16px #c0020a55',
          textAlign: 'center',
          zIndex: 2,
          borderTop: '2.5px solid rgba(218, 12, 12, 0.92)',
          borderBottom: '2.5px solid rgba(218, 12, 12, 0.92)',
        }}>
          Welcome to Touch Switzerland
        </div>
      </div>
      {/* Video Banner End */}
      <div style={{ width: '100%', minHeight: 320, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'none', gap: 36 }}>
        {/* Ranking block */}
        <div style={{ minWidth: 460, maxWidth: 680, flex: 1, padding: '32px 0 32px 0', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <button
              onClick={handlePrev}
              style={{
                background: '#eee', color: '#c00', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 4px #c0020a11', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}
              aria-label="Classement précédent"
              title="Classement précédent"
            >
              &#8592;
            </button>
            <span style={{ fontWeight: 700, color: '#c00', fontSize: 18, minWidth: 120, textAlign: 'center', letterSpacing: 1 }}>{classementTabs[classementTab].label}</span>
            <button
              onClick={handleNext}
              style={{
                background: '#eee', color: '#c00', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 4px #c0020a11', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}
              aria-label="Classement suivant"
              title="Classement suivant"
            >
              &#8594;
            </button>
          </div>
          <div
            style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #c0020a11', padding: 18, minHeight: 120, cursor: 'pointer' }}
            onClick={() => {
              let swissTab = 'nationals';
              if (classementTab === 1) swissTab = 'regionalWest';
              if (classementTab === 2) swissTab = 'regionalEast';
              localStorage.setItem('swisscup_target_tab', swissTab);
              localStorage.setItem('swisscup_target_subtab', 'standings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Utilise la prop si dispo
              if (typeof setActiveTabFromHome === 'function') {
                setActiveTabFromHome('swisscup');
              } else {
                // Fallback : simulate click on menu
                const menuBtn = document.querySelector('nav button[title="Swiss Cup"]');
                if (menuBtn) menuBtn.click();
              }
            }}
          >
            {classementTabs[classementTab].component}
          </div>
        </div>

        {/* Posts column on the right */}
        <aside style={{
          width: 370,
          minWidth: 270,
          maxWidth: 420,
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 16,
          boxShadow: '0 2px 16px #c0020a22',
          border: '1.5px solid #f8d7da',
          padding: 24,
          marginTop: 12,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxHeight: '70vh',
          overflowY: 'auto',
        }}>
        {isAdmin && (
          <button
            style={{ background: '#c00', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 18px', marginBottom: 12, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #c0020a22' }}
            onClick={() => setShowAddPost(true)}
          >
            + Add post
          </button>
        )}
          <h2 style={{ color: '#c00', fontWeight: 700, fontSize: '1.25em', marginBottom: 12, letterSpacing: '0.04em' }}>Latest posts</h2>
          {posts.length === 0 && <div style={{ color: '#aaa', fontSize: 16 }}>No recent post.</div>}
          {posts.slice(0, 8).map((p, idx) => (
            <div
              key={idx}
              style={{ background: '#fff0f0', borderRadius: 10, boxShadow: '0 2px 8px #c0020a11', padding: 14, marginBottom: 6, display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}
              onClick={() => setSelectedPost(p)}
            >
              {p.image && <img src={p.image} alt={p.title || 'post'} style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #c00', background: '#fff' }} />}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#c00', fontSize: 17, marginBottom: 2 }}>{p.title || <span style={{ color: '#aaa' }}>[No title]</span>}</div>
                {p.text && <div style={{ color: '#222', fontSize: 15, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{p.text}</div>}
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#c00', fontSize: 14, textDecoration: 'underline' }}>Link</a>}
                <div style={{ color: '#a00', fontSize: 13, marginTop: 2 }}>{p._source}</div>
              </div>
            </div>
          ))}
        </aside>

        {/* Overlay post in large */}
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
                      background: 'rgba(218, 12, 12, 0.2)',
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
                title="Close"
              >×</button>
              {selectedPost.image && <img src={selectedPost.image} alt={selectedPost.title || 'post'} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '2.5px solid #c00', background: '#fff', marginBottom: 18 }} />}
              <div style={{ fontWeight: 700, color: '#c00', fontSize: 26, marginBottom: 10, textAlign: 'center' }}>{selectedPost.title || <span style={{ color: '#aaa' }}>[No title]</span>}</div>
              {selectedPost.text && <div style={{ color: '#222', fontSize: 18, marginBottom: 10, textAlign: 'center', whiteSpace: 'pre-line' }}>{selectedPost.text}</div>}
              {selectedPost.link && <a href={selectedPost.link} target="_blank" rel="noopener noreferrer" style={{ color: '#c00', fontSize: 17, textDecoration: 'underline', marginBottom: 8, display: 'block' }}>Link</a>}
              <div style={{ color: '#a00', fontSize: 15, marginTop: 6 }}>{selectedPost._source}</div>
            </div>
          </div>
        )}

        {/* Add Post Popup */}
        {showAddPost && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.38)',
            zIndex: 4000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <form
              style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 8px 32px #c0020a55',
                padding: 36,
                minWidth: 320,
                maxWidth: 420,
                width: '96vw',
                maxHeight: '92vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                alignItems: 'center',
              }}
              onSubmit={e => {
                e.preventDefault();
                const post = { ...newPost, _source: newPost.source };
                const postsKey = post._source === 'Formation' ? 'refereesFormationPosts' : 'refereesNewsPosts';
                const existing = JSON.parse(localStorage.getItem(postsKey) || '[]');
                localStorage.setItem(postsKey, JSON.stringify([post, ...existing]));
                setPosts(getAllPosts());
                setShowAddPost(false);
                setNewPost({ title: '', text: '', link: '', image: '', source: 'News' });
              }}
            >
              <button
                type="button"
                onClick={() => setShowAddPost(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: '#c00', color: '#fff', border: 'none', borderRadius: '50%', width: 38, height: 38, fontWeight: 900, fontSize: 26, cursor: 'pointer', boxShadow: '0 2px 8px #c0020a22', zIndex: 10, lineHeight: 1 }}
                title="Close"
              >×</button>
              <h3 style={{ color: '#c00', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Add a post</h3>
              <select value={newPost.source} onChange={e => setNewPost(p => ({ ...p, source: e.target.value }))} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}>
                <option value="News">News</option>
                <option value="Formation">Formation</option>
              </select>
              <input type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} required />
              <textarea placeholder="Text" value={newPost.text} onChange={e => setNewPost(p => ({ ...p, text: e.target.value }))} style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%', minHeight: 60 }} required />
              <input type="text" placeholder="Link (optional)" value={newPost.link} onChange={e => setNewPost(p => ({ ...p, link: e.target.value }))} style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
              <input type="text" placeholder="Image URL (optional)" value={newPost.image} onChange={e => setNewPost(p => ({ ...p, image: e.target.value }))} style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
              <button type="submit" style={{ background: '#c00', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #c0020a22', marginTop: 8 }}>Add post</button>
            </form>
          </div>
  )}
      </div>
    </>
  );
}