
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';


export default function Menu({ activeTab, setActiveTab, onAdminClick, onSearch, searchKeywords }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const wrapperRef = useRef(null);

  const flatSuggestions = React.useMemo(() => {
    if (!searchKeywords) return [];
    const arr = [];
    Object.entries(searchKeywords).forEach(([tab, words]) => {
      words.forEach(w => arr.push({ word: w, tab }));
    });
    return arr;
  }, [searchKeywords]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return flatSuggestions
      .filter(s => s.word.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, flatSuggestions]);

  useEffect(() => {
    if (filtered.length === 0) setHighlightIdx(0);
    else if (highlightIdx >= filtered.length) setHighlightIdx(0);
  }, [filtered, highlightIdx]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commitSelection = (item) => {
    setOpen(false);
    setQuery(item.word);
    if (onSearch) onSearch(item.word);
    if (item.tab) setActiveTab(item.tab);
  };
  const tabs = [
    { key: 'home', label: (
      <span style={{ filter: 'drop-shadow(0 0 2px #fff)', color: '#fff', fontSize: '1.35em', lineHeight: 1, display: 'inline-block' }}>
        {/* SVG maison blanche basique */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
          <path d="M4 13L14 5L24 13V23C24 23.5523 23.5523 24 23 24H5C4.44772 24 4 23.5523 4 23V13Z" stroke="#fff" strokeWidth="2.2" fill="#fff"/>
          <rect x="10.5" y="16" width="7" height="7" rx="1.2" fill="#e30613" stroke="#fff" strokeWidth="1.2"/>
        </svg>
      </span>
    ) },
    { key: 'about', label: t('menu.about') },
    { key: 'club', label: t('menu.club') },
    { key: 'swisscup', label: t('menu.swisscup') },
    { key: 'matchs', label: t('menu.matchs') },
    { key: 'nationalteam', label: t('menu.nationalteam') },
    { key: 'referees', label: t('menu.referees') },
    { key: 'photos', label: t('menu.photos') },
    { key: 'admin', label: t('menu.admin') },
  ];

  return (
  <header className="menu-bar" style={{
      width: '100vw',
      minWidth: '100vw',
      left: 0,
      right: 0,
      top: 0,
      background: 'linear-gradient(90deg, #e30613 0%, #b8000a 100%)',
      boxShadow: '0 4px 24px 0 #e3061322',
      marginBottom: 44,
      position: 'fixed',
      zIndex: 1000,
      padding: 0,
      borderBottom: '2.5px solid #fff',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '24px',
      height: 74,
      minHeight: 74,
      overflowX: 'hidden',
    }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '24px',
          alignItems: 'center',
          height: '100%',
          background: 'none',
          border: 'none',
          boxShadow: 'none',
          fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          minHeight: 64,
          gap: 0,
        }}
      >
        <div ref={wrapperRef} style={{ position: 'relative', marginRight: 18 }}>
          <input
            type="text"
            value={query}
            placeholder="Search..."
            onFocus={() => setOpen(true)}
            onChange={e => {
              const v = e.target.value;
              setQuery(v);
              if (onSearch) onSearch(v);
              setOpen(true);
            }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightIdx(i => (i + 1) % Math.max(filtered.length, 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightIdx(i => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
              } else if (e.key === 'Enter') {
                if (filtered[highlightIdx]) commitSelection(filtered[highlightIdx]);
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1.5px solid #e30613',
              fontSize: '1em',
              fontFamily: 'inherit',
              outline: 'none',
              minWidth: 200,
              background: '#fff',
              color: '#c00',
              boxShadow: '0 2px 8px #e3061322',
            }}
          />
          {open && filtered.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: '#fff',
              border: '1px solid #e30613',
              borderRadius: 6,
              margin: 0,
              padding: '4px 0',
              listStyle: 'none',
              boxShadow: '0 6px 18px #c0020a33',
              zIndex: 3000,
              maxHeight: 260,
              overflowY: 'auto',
            }}>
              {filtered.map((item, idx) => (
                <li
                  key={item.word + idx}
                  onMouseDown={e => { e.preventDefault(); commitSelection(item); }}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    background: idx === highlightIdx ? '#e30613' : 'transparent',
                    color: idx === highlightIdx ? '#fff' : '#c00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9em',
                    fontWeight: 600,
                  }}
                >
                  <span>{item.word}</span>
                  <span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: 10 }}>{item.tab}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {tabs.map((tab, idx) => {
          if (tab.key === 'admin') {
            return (
              <button
                key={tab.key}
                onClick={onAdminClick}
                style={{
                  background: 'none',
                  color: '#fff',
                  border: 'none',
                  borderBottom: '4px solid #fff0',
                  borderRadius: 0,
                  padding: '12px 18px 10px 18px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.16s',
                  outline: 'none',
                  minWidth: 70,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 8px #a00a',
                  textTransform: 'uppercase',
                  position: 'relative',
                }}
              >
                {tab.label}
              </button>
            );
          }
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                color: activeTab === tab.key ? '#fff' : '#fff9',
                border: 'none',
                borderBottom: activeTab === tab.key ? '4px solid #fff' : '4px solid transparent',
                borderRadius: 0,
                padding: '12px 18px 10px 18px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'all 0.16s',
                outline: 'none',
                minWidth: 70,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                letterSpacing: '0.04em',
                textShadow: activeTab === tab.key ? '0 2px 8px #a00a' : 'none',
                textTransform: 'uppercase',
                position: 'relative',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
