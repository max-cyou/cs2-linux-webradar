const MAPS = [
  "de_dust2",
  "de_mirage",
  "de_inferno",
  "de_nuke",
  "de_overpass",
  "de_ancient",
  "de_anubis",
  "de_vertigo",
  "de_train",
  "de_cache",
  "cs_office",
  "cs_italy",
  "cs_agency",
];

const MapSelector = ({ selectedMap, onMapChange }) => (
  <div className="map-switcher">
    <button
      className="icon-button"
      type="button"
      onClick={() => onMapChange("")}
      aria-label="Open map gallery"
      title="All maps"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </button>
    <label className="map-select">
      <span className="sr-only">Active map</span>
      <select value={selectedMap} onChange={(event) => onMapChange(event.target.value)}>
        {MAPS.map((map) => <option key={map} value={map}>{map}</option>)}
      </select>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="m6 8 4 4 4-4" />
      </svg>
    </label>
  </div>
);

export default MapSelector;
