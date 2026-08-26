import { useEffect, useMemo, useState } from "react";
import "./App.css";
import MapGrid from "./components/MapGrid";
import MapSelector from "./components/MapSelector";
import MaskedIcon from "./components/MaskedIcon";
import PlayerCard from "./components/PlayerCard";
import Radar from "./components/Radar";
import SettingsButton from "./components/settings";

const CONNECTION_TIMEOUT = 5000;
const PORT = 22006;
const DEFAULT_SETTINGS = {
  dotSize: 1,
  bombSize: 0.5,
  showWeapon: false,
  showNickname: false,
  showHealth: false,
};

const loadSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("radarSettings"));
    return {
      dotSize: Number(saved?.dotSize) || DEFAULT_SETTINGS.dotSize,
      bombSize: Number(saved?.bombSize) || DEFAULT_SETTINGS.bombSize,
      showWeapon: Boolean(saved?.showWeapon),
      showNickname: Boolean(saved?.showNickname),
      showHealth: Boolean(saved?.showHealth),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const App = () => {
  const [playerArray, setPlayerArray] = useState([]);
  const [mapData, setMapData] = useState();
  const [mapError, setMapError] = useState("");
  const [selectedMap, setSelectedMap] = useState(
    () => localStorage.getItem("selectedMap") || "",
  );
  const [localTeam, setLocalTeam] = useState();
  const [bombData, setBombData] = useState();
  const [settings, setSettings] = useState(loadSettings);
  const [connection, setConnection] = useState("connecting");

  useEffect(() => {
    if (selectedMap) localStorage.setItem("selectedMap", selectedMap);
    else localStorage.removeItem("selectedMap");
  }, [selectedMap]);

  useEffect(() => {
    const controller = new AbortController();

    if (!selectedMap) {
      setMapData(undefined);
      setMapError("");
      document.body.style.backgroundImage = "none";
      return () => controller.abort();
    }

    setMapError("");
    setMapData(undefined);

    fetch(`./data/${selectedMap}/data.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Map data returned ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setMapData({ ...data, name: selectedMap });
        document.body.style.backgroundImage = `url(./data/${selectedMap}/background.png)`;
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setMapError("Could not load this map");
          setMapData({ name: selectedMap });
        }
      });

    return () => controller.abort();
  }, [selectedMap]);

  useEffect(() => {
    localStorage.setItem("radarSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    let socket;
    let connectTimer;
    let retryTimer;
    let stopped = false;
    let attempts = 0;

    const connect = () => {
      if (stopped) return;

      setConnection(attempts ? "reconnecting" : "connecting");
      socket = new WebSocket(`ws://${window.location.hostname}:${PORT}/cs2_webradar`);
      connectTimer = window.setTimeout(() => socket.close(), CONNECTION_TIMEOUT);

      socket.onopen = () => {
        window.clearTimeout(connectTimer);
        attempts = 0;
        setConnection("live");
      };

      socket.onmessage = async (event) => {
        try {
          const payload = typeof event.data === "string"
            ? event.data
            : await event.data.text();
          const data = JSON.parse(payload);
          setPlayerArray(Array.isArray(data.m_players) ? data.m_players : []);
          setLocalTeam(data.m_local_team);
          setBombData(data.m_bomb);
        } catch {
          setConnection("error");
        }
      };

      socket.onerror = () => setConnection("error");
      socket.onclose = () => {
        window.clearTimeout(connectTimer);
        if (stopped) return;
        setConnection("reconnecting");
        const delay = Math.min(1000 * 2 ** attempts, 8000);
        attempts += 1;
        retryTimer = window.setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      stopped = true;
      window.clearTimeout(connectTimer);
      window.clearTimeout(retryTimer);
      socket?.close();
    };
  }, []);

  const teams = useMemo(() => ({
    terrorists: playerArray.filter((player) => player.m_team === 2),
    counterTerrorists: playerArray.filter((player) => player.m_team === 3),
  }), [playerArray]);

  const connectionMessage = {
    connecting: "Connecting to game feed",
    reconnecting: "Reconnecting to game feed",
    error: "Waiting to reconnect",
    live: "Connected to game feed",
  }[connection];

  if (!selectedMap) {
    return (
      <div className="app-shell app-shell--maps">
        <MapGrid onSelect={setSelectedMap} />
      </div>
    );
  }

  return (
    <div className="app-shell app-shell--radar">
      <header className="topbar">
        <div className="brand">
          <span className="brand__name">LINUX WEBRADAR</span>
        </div>

        <div className="topbar__credit">
          Ported on Linux by <a href="https://maxcyou.ru" target="_blank" rel="noopener noreferrer"><em>maxcyou</em></a>.
          Check the source code at <a href="https://codeberg.org/maxcyou/cs2_linux_webradar" target="_blank" rel="noopener noreferrer">codeberg.org/maxcyou/cs2_linux_webradar</a>
        </div>

        <div className="topbar__actions">
          <MapSelector selectedMap={selectedMap} onMapChange={setSelectedMap} />
          <SettingsButton settings={settings} onSettingsChange={setSettings} />
        </div>
      </header>

      <main className="radar-layout">
        <section className="team-roster team-roster--t" aria-label="Terrorists">
          <div className="team-roster__heading">
            <span>T</span>
            <span>{teams.terrorists.length}</span>
          </div>
          <div className="team-roster__cards">
            {teams.terrorists.map((player) => (
              <PlayerCard key={player.m_idx} playerData={player} />
            ))}
          </div>
        </section>

        <section className="radar-stage" aria-label="Radar">
          {playerArray.length > 0 && mapData && !mapError ? (
            <Radar
              playerArray={playerArray}
              radarImage={`./data/${mapData.name}/radar.png`}
              mapData={mapData}
              localTeam={localTeam}
              bombData={bombData}
              settings={settings}
            />
          ) : (
            <div id="radar" className="radar radar--empty">
              <div className="radar-message">
                <span className="radar-message__pulse" aria-hidden="true" />
                <strong>{mapError || "Waiting for game data"}</strong>
                <small>{mapError ? "Choose another map and try again" : connectionMessage}</small>
              </div>
            </div>
          )}
        </section>

        <section className="team-roster team-roster--ct" aria-label="Counter-Terrorists">
          <div className="team-roster__heading">
            <span>CT</span>
            <span>{teams.counterTerrorists.length}</span>
          </div>
          <div className="team-roster__cards">
            {teams.counterTerrorists.map((player) => (
              <PlayerCard key={player.m_idx} playerData={player} />
            ))}
          </div>
        </section>
      </main>

      {bombData?.m_blow_time > 0 && !bombData.m_is_defused && (
        <div className="bomb-timer" role="status">
          <MaskedIcon
            path="./assets/icons/c4_sml.png"
            size={22}
            color={
              (bombData.m_is_defusing && bombData.m_blow_time - bombData.m_defuse_time > 0 && "bg-radar-green")
              || (bombData.m_blow_time - bombData.m_defuse_time < 0 && "bg-radar-red")
              || "bg-radar-secondary"
            }
          />
          <span>{bombData.m_blow_time.toFixed(1)}s</span>
          {bombData.m_is_defusing && <small>{bombData.m_defuse_time.toFixed(1)}s defuse</small>}
        </div>
      )}
    </div>
  );
};

export default App;
