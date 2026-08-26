const MaskedIcon = ({ path, height, size, color = "bg-radar-secondary", label }) => {
  const iconSize = size || height || 18;

  return (
    <span
      className={`masked-icon ${color}`}
      style={{
        "--icon-mask": `url(${path})`,
        "--icon-size": typeof iconSize === "number" ? `${iconSize}px` : iconSize,
      }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    />
  );
};

export default MaskedIcon;
