import { atom } from "recoil";

export const projectState = atom({
  key: "project",
  default: null || "",
});

export const submittingState = atom({
  key: "submitting",
  default: false,
});

// export const autoFormatToDotState = atom({
//   key: "autoFormatToDot",
//   default: null || false,
// });

// export const darkTheme = atom({
//   key: "submitting",
//   default: false,
// });
