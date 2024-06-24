import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

const themeOverride = createTheme({
  colors: {
    // #03221f - dark-green-10
    "dark-green": ["#11c4b3", "#10b2a2", "#0ea092", "#0d8e82", "#0b7c71", "#096a61", "#085850", "#05342f", "#05342f", "#03221f"],
    // #1b887e - dark-cyan-4
    "dark-cyan": ["#28c9bb", "#25b9ab", "#21a99c", "#1e988d", "#1b887e", "#18786f", "#156760", "#115751", "#0e4741", "#0b3632"],
    // #f7941d - carrot-orange-5
    "carrot-orange": ["#fac17c", "#fab869", "#f9af56", "#f8a643", "#f89d30", "#f7941d", "#f68b0a", "#e58108", "#d27607", "#bf6b07"],
    // #f9ac4e - earth-yellow-5
    "earth-yellow": ["#fcd09a", "#fbc787", "#fabe74", "#fab561", "#f9ac4e", "#f8a33b", "#f89a28", "#f79115", "#f08808", "#dd7d08"],
    // #e8e7e3 - sea-salt-1
    "sea-salt": ["#e8e7e3", "#dfded8", "#d6d5cd", "#cdcbc3", "#c5c2b8", "#bcb9ad", "#b3b0a2", "#aaa698", "#a19d8d", "#989482"],
    //#07393C
    "primary-color": ["#edfcfd", "#dcf6f8", "#b3eef2", "#89e6eb", "#6bdee6", "#5adbe3", "#4fd8e1", "#41bfc8", "#32aab2", "#12949b"]
  },
  fontFamily: "Outfit, sans-serif",
  headings: { fontFamily: "Outfit, sans-serif" },
  defaultRadius: "xl",
  primaryColor: "primary-color",
  primaryShade: 7
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);