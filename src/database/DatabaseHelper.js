import { invoke } from '@tauri-apps/api/tauri';
import { CONFIG } from '../configs/cfg_application';


export const DBHelper = {
/** Запрос в бэкэнду - чтение списка записей */
  readRecordList: async function(condition) {
    let result = [];
    let object = await invoke('read_testlist', {dbPath: CONFIG.db.path, condition: condition});
    Array.isArray(object) && result.push(...object);

    return result;
  },
  /** Запрос в бэкэнду - чтение таблицы типоразмеров */
  readSealTypes: async function() {
    let result = [];
    let object = await invoke('read_types', {dbPath: CONFIG.db.path, table: "SealTypes"});
    Array.isArray(object) && result.push(...object);

    return result;
  },
  /** Запрос в бэкэнду - чтение таблицы типа [ID, Name] */
  readDictionary: async function(table) {
    let result = [];
    let object = await invoke('read_dictionary', {dbPath: CONFIG.db.path, table: table});
    Array.isArray(object) && result.push(...object);

    return result;
  },
  /** Запрос в бэкэнду - чтение записи */
  readRecord: async function(rec_id) {
    let object = await invoke('read_record', {dbPath: CONFIG.db.path, recId: rec_id});

    return object.length ? object[0] : {};
  },
  /** Запрос в бэкэнду - обновление записи */
  updateRecord: async function(record) {
    // record.datetest = getCurrentDate();
    let result = await invoke('write_record', {dbPath: CONFIG.db.path, record: record});

    return result;
  },
  /** Запрос в бэкэнду - удаление записи */
  deleteRecord: async function(record) {
    let result = await invoke('delete_dictionary', {dbPath: CONFIG.db.path, table: "Records", dict: record});
    return result ? record.id : 0;
  },
}