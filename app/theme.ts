import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

const themeOverride = createTheme({
  colors: {
    // #f7941d - carrot-orange-5
    "carrot-orange": [
      "#fac17c",
      "#fab869",
      "#f9af56",
      "#f8a643",
      "#f89d30",
      "#f7941d",
      "#f68b0a",
      "#e58108",
      "#d27607",
      "#bf6b07",
    ],
    // #f9ac4e - earth-yellow-5
    "earth-yellow": [
      "#fcd09a",
      "#fbc787",
      "#fabe74",
      "#fab561",
      "#f9ac4e",
      "#f8a33b",
      "#f89a28",
      "#f79115",
      "#f08808",
      "#dd7d08",
    ],

    //#07393C
    "primary-color": [
      "#edfcfd",
      "#dcf6f8",
      "#b3eef2",
      "#89e6eb",
      "#6bdee6",
      "#5adbe3",
      "#4fd8e1",
      "#41bfc8",
      "#32aab2",
      "#12949b",
    ],
  },
  fontFamily: "Outfit, sans-serif",
  headings: { fontFamily: "Outfit, sans-serif" },
  defaultRadius: "md",
  primaryColor: "primary-color",
  primaryShade: 7,
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
