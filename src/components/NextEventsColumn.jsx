import React from 'react';

// Colonne Next events extraite de Calendar.jsx
export default function NextEventsColumn({ eventList, filterTag, setFilterTag }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 320,
        maxWidth: 420,
        marginLeft: 12,
        marginRight: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        height: '100%', // S'étend sur toute la hauteur du parent
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 12px #c0020a11',
          padding: 24,
          minHeight: 120,
          height: '100%', // Prend exactement la hauteur du parent (le calendrier doit aussi avoir height: 100%)
          overflowY: 'hidden',
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: '#fff',
            background: '#c00',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            marginBottom: 16,
            letterSpacing: 1,
            textAlign: 'center',
            padding: '18px 0 12px 0',
            boxShadow: '0 1px 4px #c0020a22',
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 2,
            backgroundClip: 'padding-box',
            border: '4px solid #fff',
            borderBottom: 'none',
            boxSizing: 'border-box',
            minWidth: 0,
            minHeight: 0,
          }}
        >
          Next events
        </div>
        {/* Filtre par tag */}
        <div style={{ marginBottom: 12, marginTop: -8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            placeholder="Filtrer par tag..."
            value={filterTag || ''}
            onChange={e => setFilterTag(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1.5px solid #eee',
              fontSize: 15,
              outline: 'none',
              background: '#fafbfc',
              color: '#c00',
              fontWeight: 600,
            }}
          />
        </div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: 290, // 5 events visibles (~58px chacun)
          overflowY: 'auto',
          flex: 1
        }}>
          {Object.entries(eventList)
            .flatMap(([date, events]) => events.map(ev => ({ ...ev, date })))
            .filter(ev => {
              // Compare event date to today (actual current day)
              const eventDate = new Date(ev.date + 'T00:00:00');
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              if (eventDate < now) return false;
              if (filterTag && filterTag.trim() !== '') {
                // Filtre sur n'importe quel tag (insensible à la casse)
                const tagsArr = Array.isArray(ev.tags)
                  ? ev.tags
                  : (typeof ev.tag === 'string' ? ev.tag.split(',').map(t => t.trim()).filter(Boolean) : []);
                return tagsArr.some(t => t.toLowerCase().includes(filterTag.trim().toLowerCase()));
              }
              return true;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((ev, idx) => (
              <li
                key={ev.date + ev.title + idx}
                style={{
                  marginBottom: 18,
                  background: '#f8f9fb',
                  borderRadius: 10,
                  padding: '10px 14px',
                  boxShadow: '0 1px 4px #c0020a08',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: ev.color,
                      display: 'inline-block',
                      border: '1.5px solid #fff',
                      marginRight: 6,
                    }}
                  ></span>
                  <span style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>{ev.title}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <span style={{ color: '#888', fontSize: 14, textAlign: 'left', flex: 1 }}>
                    {ev.date.split('-').reverse().join('/')}
                  </span>
                  {Array.isArray(ev.tags) && ev.tags.length > 0 && (
                    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginLeft: 8, flex: 1 }}>
                      {ev.tags.map((tag, i) => (
                        <span
                          key={tag + i}
                          style={{
                            background: '#eee',
                            color: '#c00',
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 13,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </li>
            ))}
          {Object.keys(eventList).length === 0 && (
            <li style={{ color: '#888', fontSize: 16 }}>Aucun événement à venir</li>
          )}
        </ul>
      </div>
    </div>
  );
}
