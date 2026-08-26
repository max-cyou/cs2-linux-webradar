import { getRadarPosition, rotateRadarPosition, teamEnum } from "../utilities/utilities";

const Bomb = ({ bombData, mapData, localTeam, settings, rotation }) => {
  const basePosition = getRadarPosition(mapData, bombData);
  const position = rotateRadarPosition(basePosition, rotation);
  const isVisible = Number.isFinite(position.x)
    && Number.isFinite(position.y)
    && position.x >= 0
    && position.x <= 1
    && position.y >= 0
    && position.y <= 1;
  const color = bombData.m_is_defused
    ? "#66bb6a"
    : localTeam === teamEnum.counterTerrorist ? "#78b7e3" : "#ef5350";

  return (
    <span
      className="bomb-marker"
      style={{
        "--marker-x": `${position.x * 100}%`,
        "--marker-y": `${position.y * 100}%`,
        "--marker-color": color,
        "--marker-scale": Number(settings.bombSize) || 0.5,
        opacity: isVisible ? 1 : 0,
      }}
      aria-label="Bomb"
    />
  );
};

export default Bomb;
