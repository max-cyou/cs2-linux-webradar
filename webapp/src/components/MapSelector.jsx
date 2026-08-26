const MAPS = [
  "cs_agency",
  "cs_italy",
  "cs_office",
  "de_ancient",
  "de_anubis",
  "de_cache",
  "de_dust2",
  "de_inferno",
  "de_mirage",
  "de_nuke",
  "de_overpass",
  "de_train",
  "de_vertigo",
];

const MapSelector = ({ selectedMap, onMapChange }) => {
  return (
    <select
      value={selectedMap}
      onChange={(e) => onMapChange(e.target.value)}
      className="text-radar-primary bg-radar-panel/90 backdrop-blur-lg rounded-xl px-3 py-1.5 border border-radar-secondary/20 text-sm cursor-pointer outline-none"
    >
      <option value="">Select map</option>
      {MAPS.map((map) => (
        <option key={map} value={map}>
          {map}
        </option>
      ))}
    </select>
  );
};

export default MapSelector;
