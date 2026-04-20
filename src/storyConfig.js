export const DEFAULT_BG = "intro";

export const BACKGROUNDS = {
  intro: {
    label: "Intro",
    image: "/images/bg-intro.png",
  },
  home:{
    label: "home",
    image: "/images/home.png",
  },
};

export function getBackgroundImage(bgId) {
  return BACKGROUNDS[bgId]?.image || BACKGROUNDS[DEFAULT_BG].image;
}