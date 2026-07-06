// Brand-aligned gradient palettes used for couple avatars & cover art,
// keeping a cohesive, photographic feel without real imagery.

export const avatarGradients: Record<string, string> = {
  blush: "linear-gradient(135deg, #E9BAB0 0%, #C9897C 100%)",
  gold: "linear-gradient(135deg, #EBDBB4 0%, #C9A85F 100%)",
  sage: "linear-gradient(135deg, #BCCDB7 0%, #7E9B79 100%)",
};

export const coverGradients: Record<string, string> = {
  dusk: "linear-gradient(135deg, #F3D5CE 0%, #DC9A8D 45%, #8F574C 100%)",
  champagne: "linear-gradient(135deg, #F6EFDD 0%, #DCC189 50%, #977234 100%)",
  garden: "linear-gradient(135deg, #EDF2EC 0%, #BCCDB7 45%, #5F7D5B 100%)",
};

export function avatarBg(seed: string) {
  return avatarGradients[seed] ?? avatarGradients.blush;
}

export function coverBg(seed: string) {
  return coverGradients[seed] ?? coverGradients.dusk;
}
