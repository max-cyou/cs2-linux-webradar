import { useRef } from "react";
import {
  getRadarPosition,
  playerColors,
  rotateRadarPosition,
} from "../utilities/utilities";

const formatWeapon = (weapon) => weapon
  ?.replace(/^weapon_/, "")
  .replaceAll("_", " ")
  .toUpperCase();

const Player = ({ playerData, mapData, localTeam, settings, rotation }) => {
  const lastValidPosition = useRef(null);
  const radarPosition = getRadarPosition(mapData, playerData.m_position);
  const isValid = Number.isFinite(radarPosition.x)
    && Number.isFinite(radarPosition.y)
    && radarPosition.x >= 0
    && radarPosition.x <= 1
    && radarPosition.y >= 0
    && radarPosition.y <= 1;

  if (isValid && !playerData.m_is_dead) lastValidPosition.current = radarPosition;

  const basePosition = playerData.m_is_dead
    ? lastValidPosition.current || radarPosition
    : radarPosition;
  const effectivePosition = rotateRadarPosition(basePosition, rotation);

  const friendly = playerData.m_team === localTeam;
  const markerColor = friendly
    ? playerColors[playerData.m_color] || playerColors[0]
    : "#ef5350";
  const labels = [];

  if (settings.showNickname) labels.push(playerData.m_name || "Unknown");
  if (settings.showHealth) labels.push(`${Math.max(0, Number(playerData.m_health) || 0)} HP`);
  if (settings.showWeapon && playerData.m_weapons?.m_active) {
    labels.push(formatWeapon(playerData.m_weapons.m_active));
  }

  return (
    <span
      className={`player-marker${playerData.m_is_dead ? " player-marker--dead" : ""}${effectivePosition.x > 0.76 ? " player-marker--label-left" : ""}`}
      style={{
        "--marker-x": `${effectivePosition.x * 100}%`,
        "--marker-y": `${effectivePosition.y * 100}%`,
        "--marker-color": markerColor,
        "--marker-scale": Number(settings.dotSize) || 1,
        opacity: isValid || (playerData.m_is_dead && lastValidPosition.current) ? 1 : 0,
      }}
      title={playerData.m_name}
    >
      <span className="player-marker__direction" />
      {labels.length > 0 && !playerData.m_is_dead && (
        <span className="player-marker__label">
          {labels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
        </span>
      )}
    </span>
  );
};

export default Player;
