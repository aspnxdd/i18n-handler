"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
const languages = { spanish: 'es', english: 'en', german: 'de' };
class database {
    db;
    constructor() {
        this.db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config('db', true, false, '/'));
    }
    add(id, data, lang) {
        const mainLang = this.db.getData(`/${id}/mainLang`);
        console.log("null", typeof lang, lang);
        const currentData = typeof lang == 'string' ? this.db.getData(`/${id}/data/${lang}`) : this.db.getData(`/${id}/data/${mainLang}`);
        const key = Object.keys(data)[0];
        const value = Object.values(data);
        if (currentData[key]) {
            console.log('currentData[key]', currentData[key]);
            return false;
        }
        else {
            currentData[key] = value[0];
            this.db.push(`/${id}/data/${typeof lang == 'string' ? lang : mainLang}`, {
                ...currentData
            }, true);
            return true;
        }
    }
    updateContent(id, key, val, prevKey) {
        const mainLang = this.db.getData(`/${id}/mainLang`);
        const currentData = this.db.getData(`/${id}/data/${mainLang}`);
        delete currentData[prevKey];
        currentData[key] = val;
        this.db.push(`/${id}/data/${mainLang}`, {
            ...currentData
        }, true);
    }
    deleteEntry(id, key) {
        const mainLang = this.db.getData(`/${id}/mainLang`);
        const currentData = this.db.getData(`/${id}/data/${mainLang}`);
        delete currentData[key];
        this.db.push(`/${id}/data/${mainLang}`, {
            ...currentData
        }, true);
    }
    newProject(data) {
        const langs = new Object();
        for (const lang of data.langs) {
            const language = languages[lang];
            langs[language] = new Object();
        }
        this.db.push(`/${data.name}/`, {
            mainLang: languages[data.mainLang],
            data: langs
        }, true);
    }
    deleteOneProject(name) {
        this.db.delete(`/${name}`);
    }
    getProjects() {
        const projects = this.db.getData('/');
        const keys = Object.keys(projects);
        return keys;
    }
    getMainLang(id) {
        return this.db.getData(`/${id}/mainLang`);
    }
    getLangs(id) {
        const data = this.db.getData(`/${id}/data`);
        const langs = Object.keys(data);
        // const langKeys = langs.map((lang)=>{
        //   return Object.keys(languages).find((e )=> languages[e as langKeys]===lang);
        // })
        return langs;
    }
    getRes(id, anotherLang) {
        if (anotherLang) {
            return this.db.getData(`/${id}/data/${anotherLang}`);
        }
        return this.db.getData(`/${id}/data/${this.getMainLang(id)}`);
    }
    exportProject(id) {
        return this.db.getData(`/${id}/data`);
    }
}
exports.default = database;
