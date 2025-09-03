import React from 'react';
import './DataToggles.css';

interface DataTogglesProps {
  show: { recent: boolean; topTracks: boolean; topArtists: boolean; playlists: boolean };
  onChange: (next: { recent: boolean; topTracks: boolean; topArtists: boolean; playlists: boolean }) => void;
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  onTimeRangeChange: (v: 'short_term' | 'medium_term' | 'long_term') => void;
  onRefresh: () => void;
  onToggleReceipt: () => void;
  receiptActive: boolean;
  selectedFont: string;
  onFontChange: (font: string) => void;
  selectedCanvas: string;
  onCanvasChange: (c: string) => void;
  onExportImage: () => void;
  onExportPdf: () => void;
  exportBusy: boolean;
}

const DataToggles: React.FC<DataTogglesProps> = ({ show, onChange, timeRange, onTimeRangeChange, onRefresh, onToggleReceipt, receiptActive, selectedFont, onFontChange, selectedCanvas, onCanvasChange, onExportImage, onExportPdf, exportBusy }) => {
  const set = (key: keyof typeof show) => onChange({ ...show, [key]: !show[key] });
  const fontOptions = [
    { name: 'JetBrains Mono', value: 'JetBrains Mono' },
    { name: 'Fira Code', value: 'Fira Code' },
    { name: 'Ubuntu Mono', value: 'Ubuntu Mono' },
    { name: 'Inconsolata', value: 'Inconsolata' },
    { name: 'PT Mono', value: 'PT Mono' },
    { name: 'Courier Prime', value: 'Courier Prime' },
    { name: 'Anonymous Pro', value: 'Anonymous Pro' },
    { name: 'Share Tech Mono', value: 'Share Tech Mono' },
    { name: 'Nova Mono', value: 'Nova Mono' },
    { name: 'Cutive Mono', value: 'Cutive Mono' }
  ];
  const canvasOptions = [
    { name: 'Paper (default)', value: '/paper.png' },
    { name: 'Bananas', value: '/bananas.png' },
    { name: 'Ancient', value: '/ancient.png' },
    { name: 'Notebook', value: '/notebook.png' },
    { name: 'Origami', value: '/origami.png' },
    { name: 'Washed', value: '/washed.png' },
  ];

  // On mount pick a random canvas and notify parent so the dropdown shows a random choice each time
  React.useEffect(() => {
    const options = ['/paper.png', '/bananas.png', '/ancient.png', '/notebook.png', '/origami.png', '/washed.png'];
    const idx = Math.floor(Math.random() * options.length);
    const randomValue = options[idx];
    // Only change if different to avoid unnecessary updates
    if (randomValue !== selectedCanvas) onCanvasChange(randomValue);
  }, [onCanvasChange, selectedCanvas]);
  return (
    <div className="data-toggles">
      <div className="toggle-group">
        <label><input type="checkbox" checked={show.recent} onChange={() => set('recent')} /> Recent</label>
        <label><input type="checkbox" checked={show.topTracks} onChange={() => set('topTracks')} /> Top Tracks</label>
        <label><input type="checkbox" checked={show.topArtists} onChange={() => set('topArtists')} /> Top Artists</label>
        <label><input type="checkbox" checked={show.playlists} onChange={() => set('playlists')} /> Playlists</label>
      </div>
      <div className="time-range-group">
        <select value={timeRange} onChange={e => {
          const val = e.target.value as 'short_term' | 'medium_term' | 'long_term';
          onTimeRangeChange(val);
        }}>
          <option value="short_term">4 Weeks</option>
            <option value="medium_term">6 Months</option>
            <option value="long_term">All Time</option>
      <option disabled>────────</option>
      <option value="short_term">Recent (1 Mo)</option>
      <option value="medium_term">Season (6 Mo)</option>
      <option value="long_term">Legacy (All)</option>
        </select>
      </div>
      <div className="font-group">
        <label>Font: 
          <select value={selectedFont} onChange={e => onFontChange(e.target.value)}>
            {fontOptions.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
          </select>
        </label>
      </div>
      <div className="canvas-group">
        <label>Canvas: 
          <select value={selectedCanvas} onChange={e => onCanvasChange(e.target.value)}>
            {canvasOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <div className="action-buttons">
        <button className="btn small" onClick={onRefresh}>Refresh</button>
        <button className={`btn small ${receiptActive ? 'active' : ''}`} onClick={onToggleReceipt}>{receiptActive ? 'Hide' : 'Show'} Receipt</button>
      </div>
      {receiptActive && (
        <div className="export-group">
          <button className="btn small" disabled={exportBusy} onClick={onExportImage}>Export Image</button>
          <button className="btn small" disabled={exportBusy} onClick={onExportPdf}>Export PDF</button>
        </div>
      )}
    </div>
  );
};

export default DataToggles;
