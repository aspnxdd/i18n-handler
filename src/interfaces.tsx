import { Dispatch } from "react";


export interface IUseState<T> {
  state: T;
  setState: Dispatch<T>;
}

export interface INewProject {
  name: string;
  langs: Array<string>;
  mainLang: string;
}




