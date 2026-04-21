export const DEFAULT_BG = "intro";

export const BACKGROUNDS = {
  intro: {
    label: "Intro",
    image: "/images/bg-intro.png",
  },
  home: {
    label: "home",
    image: "/images/home.png",
  },
  leaving: {
    label: "leaving",
    image: "/images/leaving.png",
  },
  camp: {
    label: "camp",
    image: "/images/camp.png",
  },
  town: {
    label: "town",
    image: "/images/town.png",
  },
  bear: {
    label: "bear",
    image: "/images/bear.png",
  },
  cabin: {
    label: "cabin",
    image: "/images/cabin.png",
  },
  box: {
    label: "box",
    image: "/images/box.png",
  },
};

export function getBackgroundImage(bgId) {
  return BACKGROUNDS[bgId]?.image || BACKGROUNDS[DEFAULT_BG].image;
}