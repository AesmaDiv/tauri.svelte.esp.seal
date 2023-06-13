import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
// import { } from "@tauri-apps/api/path";
import { type Writable, writable, get } from "svelte/store";
import { assign } from "../funcs/shared";
import { to_number } from "svelte/internal";

const SETTINGS_PATH : string = "D:\\Projects\\Tauri\\tauri.svelte.esp.seal\\resources\\settings.json";
export let SETTINGS : Writable<Object> = writable({});

export async function readSettings() {
  readTextFile(SETTINGS_PATH)
  .then(text => {
    const settings = JSON.parse(text);
    SETTINGS.set(settings);
    console.log("Файл конфигурации загружен. %o", get(SETTINGS));
  })
  .catch(reason => console.error("Ошибка чтения файла конфигурации: %o", reason));
}

export async function saveSettings(form: FormData, refresh: boolean = false) {
  let settings = {};
  form.forEach((v, k) => {
    const value = ["ip_address", "db_path"].includes(k) ? v.toString() : to_number(v);
    assign(settings, k.split("."), value)
  });
  writeTextFile(SETTINGS_PATH, JSON.stringify(settings, null, 2))
  .then(() => {
    console.log("Файл конфигурации сохранён.");
    refresh && readSettings();
  })
  .catch(reason => console.error("Ошибка записи файла конфигурации: %o", reason));
}