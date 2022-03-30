import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const languages = { spanish: 'es', english: 'en', german: 'de' } as const;

interface NewProject {
  name: string;
  langs: Array<keyof typeof languages>;
  mainLang: keyof typeof languages;
}
type langKeys = keyof typeof  languages;
type lang = typeof languages[langKeys];

class database {
  db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('db', true, false, '/'));
  }

  add(id: string, data: Object, lang: string | null) {
    const mainLang = this.db.getData(`/${id}/mainLang`);
    console.log("null", typeof lang, lang);
    const currentData =
      typeof lang == 'string' ? this.db.getData(`/${id}/data/${lang}`) : this.db.getData(`/${id}/data/${mainLang}`);
    const key = Object.keys(data)[0];
    const value = Object.values(data);

    if (currentData[key]) {
      console.log('currentData[key]', currentData[key]);
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

  getMainLang(id: string) {
    return this.db.getData(`/${id}/mainLang`);
  }

  getLangs(id: string) {
    const data = this.db.getData(`/${id}/data`);
    const langs = Object.keys(data);
    // const langKeys = langs.map((lang)=>{
    //   return Object.keys(languages).find((e )=> languages[e as langKeys]===lang);
    // })
    return langs;
  }

  getRes(id: string, anotherLang?: string) {
    if (anotherLang) {
      return this.db.getData(`/${id}/data/${anotherLang}`);
    }
    return this.db.getData(`/${id}/data/${this.getMainLang(id)}`);
  }

  exportProject(id: string) {
    
    return this.db.getData(`/${id}/data`);
  }
}

export default database;
