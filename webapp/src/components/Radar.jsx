import { useEffect, useRef, useState } from "react";
import Player from "./player";
import Bomb from "./bomb";

const Radar = ({ playerArray, radarImage, mapData, localTeam, bombData, settings }) => {
  const frameRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBrowserExpanded, setIsBrowserExpanded] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (!isBrowserExpanded) return undefined;
    const restoreOnEscape = (event) => {
      if (event.key === "Escape") setIsBrowserExpanded(false);
    };
    document.addEventListener("keydown", restoreOnEscape);
    return () => document.removeEventListener("keydown", restoreOnEscape);
  }, [isBrowserExpanded]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === frameRef.current) await document.exitFullscreen();
      else await frameRef.current?.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`radar-frame${isBrowserExpanded ? " radar-frame--expanded" : ""}`}
      ref={frameRef}
    >
      <div id="radar" className="radar">
        <div className="radar-map-layer" style={{ transform: `rotate(${rotation}deg)` }}>
          <img className="radar__image" src={radarImage} alt={`${mapData.name} radar`} draggable="false" />
        </div>

        {playerArray.map((player) => (
          <Player
            key={player.m_idx}
            playerData={player}
            mapData={mapData}
            localTeam={localTeam}
            settings={settings}
            rotation={rotation}
          />
        ))}

        {bombData && (
          <Bomb
            bombData={bombData}
            mapData={mapData}
            localTeam={localTeam}
            settings={settings}
            rotation={rotation}
          />
        )}

        <div className="radar-controls">
          <button
            type="button"
            onClick={() => setRotation((current) => (current + 90) % 360)}
            aria-label="Rotate map 90 degrees"
            title="Rotate map 90°"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 7v5h-5" />
              <path d="M18.5 16a8 8 0 1 1 .9-7.8L20 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsBrowserExpanded((expanded) => !expanded)}
            aria-label={isBrowserExpanded ? "Restore map layout" : "Expand map in browser"}
            title={isBrowserExpanded ? "Restore layout" : "Fill browser window"}
          >
            {isBrowserExpanded ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 7 7 17M15 17H7V9" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Radar;
