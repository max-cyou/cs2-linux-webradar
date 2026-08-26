import { useEffect, useRef, useState } from "react";

const SettingsButton = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="settings" ref={rootRef}>
      <button
        type="button"
        className={`settings__button${isOpen ? " is-active" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.4l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.6 7l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.3a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
        <span>Settings</span>
      </button>

      {isOpen && (
        <div className="settings-panel" role="dialog" aria-label="Radar settings">
          <div className="settings-panel__header">
            <div>
              <strong>Radar settings</strong>
              <small>Saved automatically</small>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close settings">×</button>
          </div>

          <label className="setting-control">
            <span><span>Player markers</span><output>{settings.dotSize.toFixed(1)}×</output></span>
            <input
              type="range"
              min="0.8"
              max="2"
              step="0.1"
              value={settings.dotSize}
              onChange={(event) => onSettingsChange({ ...settings, dotSize: Number(event.target.value) })}
            />
          </label>

          <label className="setting-control">
            <span><span>Bomb marker</span><output>{settings.bombSize.toFixed(1)}×</output></span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.bombSize}
              onChange={(event) => onSettingsChange({ ...settings, bombSize: Number(event.target.value) })}
            />
          </label>

          <fieldset className="player-label-settings">
            <legend>Show next to player</legend>
            <label>
              <input
                type="checkbox"
                checked={settings.showWeapon}
                onChange={(event) => onSettingsChange({ ...settings, showWeapon: event.target.checked })}
              />
              <span>Active weapon</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.showNickname}
                onChange={(event) => onSettingsChange({ ...settings, showNickname: event.target.checked })}
              />
              <span>Nickname</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.showHealth}
                onChange={(event) => onSettingsChange({ ...settings, showHealth: event.target.checked })}
              />
              <span>Health</span>
            </label>
          </fieldset>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;
