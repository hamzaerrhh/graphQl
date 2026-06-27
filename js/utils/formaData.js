export function formatXP(value) {
  if (value >= 1000000) return (value / 1000000).toFixed(2) + " MB";
  if (value >= 1000) return (value / 1000).toFixed(2) + " kB";
  return value + " B";
}

export const formatSkills = (skills) => {
  const radar1Keys = ["prog", "tcp", "algo", "game", "ai", "stats", "back", "front", "devops"];
  const radar2Keys = ["go", "js", "html", "css", "unix", "docker", "sql", "git"];

  const topValues = {};
  skills.forEach(item => {
    let name = item.type.replace("skill_", "").toLowerCase();
    if (name === "front-end") name = "front";
    if (name === "back-end") name = "back";
    if (name === "sys-admin") name = "devops";
    topValues[name] = Math.max(topValues[name] || 0, item.amount);
  });

  const mapToRadarStructure = (radarKeys) => {
    return radarKeys.map(key => ({
      axis: key.charAt(0).toUpperCase() + key.slice(1),
      value: topValues[key] || 0
    }));
  };

  return {
    radar1: mapToRadarStructure(radar1Keys),
    radar2: mapToRadarStructure(radar2Keys)
  };
};
