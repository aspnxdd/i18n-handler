import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const languages = { spanish: 'es', english: 'en', german: 'de' } as const;

interface NewProject {
  name: string;
  langs: Array<keyof typeof languages>;
  mainLang: keyof typeof languages;
}
// type langs = {
//   [K in keyof typeof languages]: string
// }
type langKeys = keyof typeof languages;
type lang = typeof languages[langKeys];

interface db {
  add(id: string, data: Object, lang: string | null): boolean;
  updateContent(id: string, key: string, val: string, prevKey: string): void;
  deleteEntry(id: string, key: string): void;
  newProject(data: NewProject): void;
  deleteOneProject(name: string): void;
  getProjects(): string[];
  getLangs(id: string): string[];
  getRes(id: string, anotherLang?: string): Object;
  exportProject(id: string): Object;
}

class database implements db {
  private db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('db', true, false, '/'));
  }

  add(id: string, data: Object, lang: string | null) {
    const mainLang = this.db.getData(`/${id}/mainLang`);
    console.log('null', typeof lang, lang);
    const currentData =
      typeof lang == 'string' ? this.db.getData(`/${id}/data/${lang}`) : this.db.getData(`/${id}/data/${mainLang}`);
    const key = Object.keys(data)[0];
    const value = Object.values(data);

    if (currentData[key]) {
      return false;
    } else {
      currentData[key] = value[0];

      this.db.push(
        `/${id}/data/${typeof lang == 'string' ? lang : mainLang}`,
        {
          ...currentData
        },
        true
      );

      return true;
    }
  }

  updateContent(id: string, key: string, val: string, prevKey: string,anotherLang?: string) {
    const lang = anotherLang ?? this.getMainLang(id);
    const currentData = this.db.getData(`/${id}/data/${lang}`);
    delete currentData[prevKey];
    currentData[key] = val; 
    this.db.push(
      `/${id}/data/${lang}`,
      {
        ...currentData
      },
      true
    );
  }

  deleteEntry(id: string, key: string,anotherLang?: string) {
    const lang = anotherLang ?? this.getMainLang(id);
    const currentData = this.db.getData(`/${id}/data/${lang}`);
    delete currentData[key];

    this.db.push(
      `/${id}/data/${lang}`,
      {
        ...currentData
      },
      true
    );
  }

  newProject(data: NewProject) {
    const langs: Partial<Record<lang, Object>> = new Object();
    for (const lang of data.langs) {
      const language = languages[lang] as lang;
      langs[language] = new Object();
    }
    this.db.push(
      `/${data.name}/`,
      {
        mainLang: languages[data.mainLang],
        data: langs
      },
      true
    );
  }

  deleteOneProject(name: string) {
    this.db.delete(`/${name}`);
  }

  getProjects() {
    const projects = this.db.getData('/');
    const keys = Object.keys(projects);
    return keys;
  }

  private getMainLang(id: string) {
    return this.db.getData(`/${id}/mainLang`) as string;
  }

  getLangs(id: string) {
    const data = this.db.getData(`/${id}/data`);
    const langs = Object.keys(data);

    return langs;
  }

  getRes(id: string, anotherLang?: string) {
    const lang = anotherLang ?? this.getMainLang(id);


    return this.db.getData(`/${id}/data/${lang}`) as Object;
  }
   

  exportProject(id: string) {
    return this.db.getData(`/${id}/data`) as Object;
  }
}

export default database;
