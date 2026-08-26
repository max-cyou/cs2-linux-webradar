import { useEffect, useState } from "react";
import MaskedIcon from "./MaskedIcon";
import { playerColors } from "../utilities/utilities";

const clampStat = (value) => Math.max(0, Math.min(Number(value) || 0, 100));

const PlayerCard = ({ playerData }) => {
  const [modelName, setModelName] = useState(playerData.m_model_name);
  const health = clampStat(playerData.m_health);
  const armor = clampStat(playerData.m_armor);
  const borderColor = playerColors[playerData.m_color] || "#84c8ed";
  const activeWeapon = playerData.m_weapons?.m_active;

  useEffect(() => {
    if (playerData.m_model_name) setModelName(playerData.m_model_name);
  }, [playerData.m_model_name]);

  const inventory = [
    playerData.m_weapons?.m_primary,
    playerData.m_weapons?.m_secondary,
    ...(playerData.m_weapons?.m_melee || []),
    ...(playerData.m_weapons?.m_utilities || []),
  ].filter(Boolean);

  if (playerData.m_team === 3 && playerData.m_has_defuser) inventory.push("defuser");
  if (playerData.m_team === 2 && playerData.m_has_bomb) inventory.push("c4");

  return (
    <article
      className={`player-card${playerData.m_is_dead ? " player-card--dead" : ""}`}
      style={{ "--player-color": borderColor }}
    >
      <div className="player-card__avatar" aria-hidden="true">
        <svg className="player-card__avatar-fallback" viewBox="0 0 100 100">
          <circle cx="50" cy="34" r="19" />
          <ellipse cx="50" cy="88" rx="34" ry="28" />
        </svg>
        {modelName && (
          <img
            src={`./assets/characters/${modelName}.png`}
            alt=""
            draggable="false"
            onError={(event) => { event.currentTarget.hidden = true; }}
          />
        )}
      </div>

      <div className="player-card__body">
        <div className="player-card__topline">
          <button
            type="button"
            className="player-card__name"
            onClick={() => window.open(
              `https://steamcommunity.com/profiles/${playerData.m_steam_id}`,
              "_blank",
              "noopener,noreferrer",
            )}
            title={playerData.m_name}
          >
            {playerData.m_name || "Unknown"}
          </button>
          <span className="player-card__money">${playerData.m_money || 0}</span>
        </div>

        <div className="player-card__stats">
          <div className="player-stat" title={`${health} health`}>
            <span className="player-stat__label">
              <MaskedIcon path="./assets/icons/health.svg" size="0.78rem" />
              <span>{health}</span>
            </span>
            <span className="player-stat__track">
              <span
                className={`player-stat__fill player-stat__fill--health${health <= 25 ? " is-low" : health <= 60 ? " is-mid" : ""}`}
                style={{ width: `${health}%` }}
              />
            </span>
          </div>
          <div className="player-stat" title={`${armor} armor`}>
            <span className="player-stat__label">
              <MaskedIcon
                path={`./assets/icons/${playerData.m_has_helmet ? "kevlar_helmet" : "kevlar"}.svg`}
                size="0.78rem"
              />
              <span>{armor}</span>
            </span>
            <span className="player-stat__track">
              <span className="player-stat__fill player-stat__fill--armor" style={{ width: `${armor}%` }} />
            </span>
          </div>
        </div>

        <div className="player-card__inventory" aria-label="Inventory">
          {inventory.map((item, index) => (
            <MaskedIcon
              key={`${item}-${index}`}
              path={`./assets/icons/${item}.svg`}
              size="clamp(0.72rem, 1.4vw, 1.25rem)"
              color={activeWeapon === item ? "bg-radar-primary" : "bg-radar-secondary"}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

export default PlayerCard;
