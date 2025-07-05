import React, { useState, useEffect, useRef } from 'react';

export default function Photos({ isAdmin, adminEmail }) {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null); // Référence au champ fichier

  // Charger les photos depuis localStorage au chargement
  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
    setPhotos(storedPhotos);
  }, []);

  // Enregistrer dans localStorage à chaque mise à jour
  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newBase64Photos) => {
      setPhotos((prev) => [...prev, ...newBase64Photos]);
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Ouvre le sélecteur de fichier
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ color: '#c00' }}>Galerie Photos</h2>

      {isAdmin && (
        <div style={{ marginBottom: '16px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={triggerFileInput}
            style={{
              backgroundColor: '#c00',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Ajouter des photos
          </button>
        </div>
      )}

      {photos.length === 0 ? (
        <p style={{ color: '#666' }}>Aucune photo ajoutée pour l’instant.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          {photos.map((src, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <img
                src={src}
                alt={`photo-${idx}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '2px solid #c00',
                  display: 'block',
                }}
              />
              {isAdmin && (
                <button
                  onClick={() => {
                    if (window.confirm('Supprimer cette photo ?')) {
                      setPhotos(photos.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: '#c00',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 18,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                  title="Supprimer la photo"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
