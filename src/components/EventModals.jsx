import React from 'react';

export function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
  eventForm,
  setEventForm
}) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        zIndex: 4000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <form
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 32px #c0020a55',
          padding: 36,
          minWidth: 320,
          maxWidth: 420,
          width: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={e => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: '#c00',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontWeight: 900,
            fontSize: 20,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #c0020a22',
            zIndex: 10,
            lineHeight: 1,
          }}
          title="Fermer"
        >×</button>
        <h3 style={{ color: '#c00', fontWeight: 700, marginBottom: 18 }}>Ajouter un événement</h3>
        <label style={{ width: '100%', marginBottom: 10 }}>
          Date :
          <input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} required />
        </label>
        <label style={{ width: '100%', marginBottom: 10 }}>
          Titre :
          <input type="text" value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} required />
        </label>
        <label style={{ width: '100%', marginBottom: 10 }}>
          Couleur :
          <input type="color" value={eventForm.color} onChange={e => setEventForm(f => ({ ...f, color: e.target.value }))} style={{ width: 40, height: 32, marginLeft: 8, verticalAlign: 'middle', border: 'none', background: 'none' }} />
        </label>
        <label style={{ width: '100%', marginBottom: 18 }}>
          Tags (séparés par des virgules) :
          <input type="text" value={eventForm.tags || ''} onChange={e => setEventForm(f => ({ ...f, tags: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} placeholder="ex: U15, tournoi, extérieur" />
        </label>
        {eventForm.tags && eventForm.tags.split(',').filter(t => t.trim()).length > 0 && (
          <div style={{ width: '100%', marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {eventForm.tags.split(',').map((tag, i) => tag.trim() && (
              <span key={i} style={{ background: '#eee', color: '#c00', borderRadius: 6, padding: '2px 8px', fontSize: 13 }}>{tag.trim()}</span>
            ))}
          </div>
        )}
        <button type="submit" style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginTop: 8 }}>Ajouter</button>
      </form>
    </div>
  );
}

export function EditEventForm({
  isAdmin,
  show,
  eventsForDay,
  editEventIdx,
  editEventForm,
  setEditEventForm,
  handleSaveEdit,
  handleCancelEdit,
  handleStartEdit,
  handleDeleteEvent,
  selectedDay
}) {
  if (!show) return null;
  // Helper pour afficher les tags comme badges
  const renderTags = tags => {
    if (!tags) return null;
    const arr = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
    return arr.length > 0 && (
      <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, marginLeft: 8 }}>
        {arr.map((tag, i) => (
          <span key={tag + i} style={{ background: '#eee', color: '#c00', borderRadius: 6, padding: '2px 8px', fontSize: 13 }}>{tag}</span>
        ))}
      </span>
    );
  };
  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none', width: '100%' }}>
      {eventsForDay.map((ev, idx) => (
        <li key={idx} style={{ color: ev.color || '#222', fontSize: 18, marginBottom: 8, borderLeft: `4px solid ${ev.color || '#c00'}`, paddingLeft: 10, position: 'relative', background: editEventIdx === idx ? '#f8f8f8' : undefined }}>
          {isAdmin && editEventIdx === idx ? (
            <form onSubmit={e => { e.preventDefault(); handleSaveEdit(selectedDay.dateKey, idx); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="text" value={editEventForm.title} onChange={e => setEditEventForm(f => ({ ...f, title: e.target.value }))} style={{ fontSize: 16, padding: 4, borderRadius: 4, border: '1px solid #ccc', width: 120 }} required />
              <input type="color" value={editEventForm.color} onChange={e => setEditEventForm(f => ({ ...f, color: e.target.value }))} style={{ width: 32, height: 24, border: 'none', background: 'none' }} />
              <input type="text" value={editEventForm.tags || ''} onChange={e => setEditEventForm(f => ({ ...f, tags: e.target.value }))} style={{ fontSize: 14, padding: 4, borderRadius: 4, border: '1px solid #ccc', width: 90 }} placeholder="Tags (virgules)" />
              <button type="submit" style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>OK</button>
              <button type="button" onClick={handleCancelEdit} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Annuler</button>
            </form>
          ) : (
            <>
              <span>{ev.title}</span>
              {renderTags(ev.tags || ev.tag)}
              {isAdmin && (
                <>
                  <button onClick={() => handleStartEdit(ev, idx)} style={{ marginLeft: 10, background: '#ffb300', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Éditer</button>
                  <button onClick={() => handleDeleteEvent(selectedDay.dateKey, idx)} style={{ marginLeft: 6, background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Supprimer</button>
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
