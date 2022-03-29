"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
const languages = { spanish: "es", english: "en", german: "de" };
class database {
    constructor() {
        this.db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("db", true, false, "/"));
    }
    add(id, data) {
        const mainLang = this.db.getData(`/${id}/mainLang`);
        const currentData = this.db.getData(`/${id}/data/${mainLang}`);
        const key = Object.keys(data);
        const value = Object.values(data);
        return new Promise((res, rej) => {
            if (currentData[key]) {
                console.log("currentData[key]", currentData[key]);
                return rej();
            }
            currentData[key] = value[0];
            this.db.push(`/${id}/data/${mainLang}`, {
                ...currentData,
            }, true);
            return res();
        });
    }
    updateContent(id, key, val, prevKey) {
        const mainLang = this.db.getData(`/${id}/mainLang`);
        const currentData = this.db.getData(`/${id}/data/${mainLang}`);
        delete currentData[prevKey];
        currentData[key] = val;
        this.db.push(`/${id}/data/${mainLang}`, {
            ...currentData,
        }, true);
    }
    deleteEntry(id, key) {
        const mainLang = this.db.getData(`/${id}/mainLang`);
        const currentData = this.db.getData(`/${id}/data/${mainLang}`);
        delete currentData[key];
        this.db.push(`/${id}/data/${mainLang}`, {
            ...currentData,
        }, true);
    }
    newProject({ data }) {
        const langs = {};
        data.langs.forEach((lang) => {
            langs[languages[lang]] = new Object();
        });
        this.db.push(`/${data.name}/`, {
            mainLang: languages[data.mainLang],
            data: langs,
        }, true);
    }
    deleteOneProject(name) {
        this.db.delete(`/${name}`);
    }
    getProjects() {
        const projects = this.db.getData("/");
        const keys = Object.keys(projects);
        return keys;
    }
    getMainLang(id) {
        return this.db.getData(`/${id}/mainLang`);
    }
    getRes(id) {
        return this.db.getData(`/${id}/data/${this.getMainLang(id)}`);
    }
}
exports.default = database;
