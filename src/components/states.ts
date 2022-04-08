import { atom } from "recoil";

export const projectState = atom({
  key: "project",
  default: null || "",
});

export const submittingState = atom({
  key: "submitting",
  default: false,
});


