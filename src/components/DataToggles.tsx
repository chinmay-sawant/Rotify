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
}

const DataToggles: React.FC<DataTogglesProps> = ({ show, onChange, timeRange, onTimeRangeChange, onRefresh, onToggleReceipt, receiptActive }) => {
  const set = (key: keyof typeof show) => onChange({ ...show, [key]: !show[key] });
  return (
    <div className="data-toggles">
      <div className="toggle-group">
        <label><input type="checkbox" checked={show.recent} onChange={() => set('recent')} /> Recent</label>
        <label><input type="checkbox" checked={show.topTracks} onChange={() => set('topTracks')} /> Top Tracks</label>
        <label><input type="checkbox" checked={show.topArtists} onChange={() => set('topArtists')} /> Top Artists</label>
        <label><input type="checkbox" checked={show.playlists} onChange={() => set('playlists')} /> Playlists</label>
      </div>
      <div className="time-range-group">
  <select value={timeRange} onChange={e => onTimeRangeChange(e.target.value as 'short_term' | 'medium_term' | 'long_term')}>
          <option value="short_term">4 Weeks</option>
            <option value="medium_term">6 Months</option>
            <option value="long_term">All Time</option>
        </select>
      </div>
      <button className="btn small" onClick={onRefresh}>Refresh</button>
      <button className={`btn small ${receiptActive ? 'active' : ''}`} onClick={onToggleReceipt}>{receiptActive ? 'Hide' : 'Show'} Receipt</button>
    </div>
  );
};

export default DataToggles;
