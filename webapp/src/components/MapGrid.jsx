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

const formatMapName = (map) => map.replace(/^de_|^cs_/, "").replaceAll("_", " ");

const MapGrid = ({ onSelect }) => (
  <main className="map-picker">
    <header className="map-picker__header">
      <span className="map-picker__eyebrow">LINUX WEBRADAR</span>
      <h1>Choose a map</h1>
      <p>Select the active map before game data arrives.</p>
    </header>

    <div className="map-grid">
      {MAPS.map((map) => (
        <button
          className="map-card"
          key={map}
          onClick={() => onSelect(map)}
          type="button"
        >
          <span className="map-card__preview">
            <img
              src={`./data/${map}/radar.png`}
              alt=""
              loading="lazy"
              draggable="false"
              onError={(event) => { event.currentTarget.hidden = true; }}
            />
            <span className="map-card__glow" aria-hidden="true" />
          </span>
          <span className="map-card__label">
            <strong>{formatMapName(map)}</strong>
            <small>{map.startsWith("cs_") ? "Hostage" : "Defusal"}</small>
          </span>
        </button>
      ))}
    </div>
  </main>
);

export default MapGrid;
