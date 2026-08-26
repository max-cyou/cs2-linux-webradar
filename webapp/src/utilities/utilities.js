export const getRadarPosition = (mapData, entityCoords) => {
  const entityX = Number(entityCoords?.x);
  const entityY = Number(entityCoords?.y);
  const mapX = Number(mapData?.x);
  const mapY = Number(mapData?.y);
  const scale = Number(mapData?.scale);

  if (![entityX, entityY, mapX, mapY, scale].every(Number.isFinite) || scale === 0) {
    return { x: 0, y: 0 };
  }

  const position = {
    x: (entityX - mapX) / scale / 1024,
    y: (((entityY - mapY) / scale) * -1) / 1024,
  };

  return position;
};

export const rotateRadarPosition = (position, rotation = 0) => {
  switch (((rotation % 360) + 360) % 360) {
    case 90:
      return { x: 1 - position.y, y: position.x };
    case 180:
      return { x: 1 - position.x, y: 1 - position.y };
    case 270:
      return { x: position.y, y: 1 - position.x };
    default:
      return position;
  }
};

export const playerColors = [
  // blue
  "#84c8ed",

  // green
  "#009a7d",

  // yellow
  "#eadd40",

  // orange
  "#df7d29",

  // purple
  "#b72b92",

  // white
  "#ffffff",
];

export const teamEnum = {
  none: 0,
  spectator: 1,
  terrorist: 2,
  counterTerrorist: 3,
};
