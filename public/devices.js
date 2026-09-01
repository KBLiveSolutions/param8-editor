function deviceDisplayName(className) {
  const def = defaultsData[className];
  if (def && def.display_name) return def.display_name;
  return className;
}

function deviceCategory(className) {
  const def = defaultsData[className];
  if (def && def.category) return def.category;
  return "audio_effects";
}
