import { useRef } from "react";
import Player from "./player";
import Bomb from "./bomb";

const Radar = ({
  playerArray,
  radarImage,
  mapData,
  localTeam,
  bombData,
  settings
}) => {
  const radarImageRef = useRef();

  return (
    <div id="radar" className={`relative overflow-hidden origin-center`}>
      <img ref={radarImageRef} className={`w-full h-auto`} src={radarImage} />

      {playerArray.map((player) => (
        <Player
          key={player.m_idx}
          playerData={player}
          mapData={mapData}
          radarImage={radarImageRef.current}
          localTeam={localTeam}
          settings={settings}
        />
      ))}

      {bombData && (
        <Bomb
          bombData={bombData}
          mapData={mapData}
          radarImage={radarImageRef.current}
          localTeam={localTeam}
          settings={settings}
        />
      )}
    </div>
  );
};

export default Radar;
