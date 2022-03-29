import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const languages = { spanish: 'es', english: 'en', german: 'de' } as const;

interface NewProject {
  name: string;
  langs: Array<keyof typeof languages>;
  mainLang: keyof typeof languages;
}

class database {
  db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('db', true, false, '/'));
  }

  add(id: string, data: Object): Promise<void> {
    const mainLang = this.db.getData(`/${id}/mainLang`);
    const currentData = this.db.getData(`/${id}/data/${mainLang}`);
    const key = Object.keys(data)[0];
    const value = Object.values(data);
    return new Promise((res, rej) => {
      if (currentData[key]) {
        console.log('currentData[key]', currentData[key]);
        return rej();
      }

      currentData[key] = value[0];

      this.db.push(
        `/${id}/data/${mainLang}`,
        {
          ...currentData
        },
        true
      );

      return res();
    });
  }

  updateContent(id: string, key: string, val: string, prevKey: string) {
    const mainLang = this.db.getData(`/${id}/mainLang`);
    const currentData = this.db.getData(`/${id}/data/${mainLang}`);

    delete currentData[prevKey];

    currentData[key] = val;

    this.db.push(
      `/${id}/data/${mainLang}`,
      {
        ...currentData
      },
      true
    );
  }

  deleteEntry(id: string, key: string) {
    const mainLang = this.db.getData(`/${id}/mainLang`);
    const currentData = this.db.getData(`/${id}/data/${mainLang}`);

    delete currentData[key];

    this.db.push(
      `/${id}/data/${mainLang}`,
      {
        ...currentData
      },
      true
    );
  }

  newProject(data: NewProject) {
    type lang = typeof languages[keyof typeof languages];
    const langs: Partial<Record<lang, Object>> = new Object();
    data.langs.forEach((lang: keyof typeof languages) => {
      const language = languages[lang] as lang;
      langs[language] = new Object();
    });
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

  getMainLang(id: string) {
    return this.db.getData(`/${id}/mainLang`);
  }

  getRes(id: string) {
    return this.db.getData(`/${id}/data/${this.getMainLang(id)}`);
  }
}

export default database;
