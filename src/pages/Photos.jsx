
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';


export default function Photos({ isAdmin, adminEmail }) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
    setPhotos(storedPhotos);
  }, []);

  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  // Trigger file input dialog
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset
      fileInputRef.current.click();
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    // Read each file as DataURL
    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(imgs => {
      setPhotos(prev => [...prev, ...imgs]);
    });
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ color: '#c00' }}>{t('photos.galleryTitle')}</h2>

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
              fontWeight: 'bold',
              fontSize: '1em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #c0020a22',
            }}
          >
            {t('photos.addPhotos')}
          </button>
        </div>
      )}

      {photos.length === 0 ? (
        <p style={{ color: '#666' }}>{t('photos.noPhotos')}</p>
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
                    if (window.confirm(t('photos.deleteConfirm'))) {
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
                  title={t('photos.deletePhoto')}
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
