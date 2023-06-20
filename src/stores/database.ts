import { message } from "@tauri-apps/api/dialog";
import { get, writable, type Writable } from "svelte/store";
import { DBHelper} from "../database/DatabaseHelper";
import { getPointsFromRecord, serializePoints } from "../database/db_funcs";
import type { Limits } from "../lib/Chart/chart";
import { getCurrentDate } from "../shared/funcs";
import type { TestStates, PressPoint, PowerPoint } from "../shared/types";
import { SETTINGS } from "./settings";

export let TESTLIST: Writable<any[]> = writable([]);
export let RECORD: Writable<{}> = writable({});
export let SEALTYPES_LIST: Writable<any[]> = writable([]);
export let LIMITS_PRESS: Writable<Limits[]> = writable([]);
export let CURRENT_SEALTYPE: Writable<{}> = writable({});

let db_path = "";
SETTINGS.subscribe(async (settings) => {
  // при изменении настроек ->
  // перечитать типы и список тестов
  if (db_path = settings['db_path']) {
    await readSealtypes();
    await readTestList({select_first: true});
  }
});
// при изменении текущего типа ->
// перечитать пределы давления диафрагм
CURRENT_SEALTYPE.subscribe(updateLimitsPress)

/** Точки графиков давления диафрагм */
export let POINTS_PRESS: Writable<PressPoint[]> = writable([]);
/** Точки графиков измерения потребляемой мощности */
export let POINTS_POWER: Writable<PowerPoint[]> = writable([]);

/** Чтение списка тестов */
export async function readTestList({condition="ID > 0", select_first=false}={}) {
  let testlist: any[] = await DBHelper.readRecordList(db_path, `${condition} Order By ID Desc Limit 100`);
  TESTLIST.set(testlist);
  console.warn('СПИСОК ТЕСТОВ обновлён');

  // если указан выбор первого в списке и список не пуст ->
  // загрузить первую запись
  select_first && testlist.length && readRecord(testlist[0].id);
}

/** Чтение записи из БД */
export async function readRecord(id: number) {
  // собственно..
  let record = await DBHelper.readRecord(db_path, id);
  RECORD.set(record);
  console.warn('ЗАПИСЬ загружена\n%o', record);

  // получение информации о типоразмере
  let type_id : number = record['sealtype'];
  let sealtype : Object = get(SEALTYPES_LIST).find(item => item['id'] === type_id);
  CURRENT_SEALTYPE.set(sealtype);
  console.warn('ТЕКУЩИЙ ТИПОРАЗМЕР загружен\n%o', sealtype);

  // получение точек испытаний
  let points = await getPointsFromRecord(record);
  POINTS_PRESS.set(points.test_press);
  POINTS_POWER.set(points.test_power);
  console.warn('ТОЧКИ ИСПЫТАНИЙ загружены\n%o', points);
}
/** Чтение доступных типоразмеров */
export async function readSealtypes() {
  let types: any[] = await DBHelper.readSealTypes(db_path);
  SEALTYPES_LIST.set(types);
  console.warn('СПИСОК ТИПОРАЗМЕРОВ загружен');
}
/** Запись данных о точках в БД */
export async function updatePoints(test_state: TestStates, points_data: PressPoint[] | PowerPoint[]) {
  if (!points_data) { console.warn('Отсутствуют данные для записи'); return; }
  let id : number;
  if (id = get(RECORD)['id']) {
    let record = { id, [test_state]: serializePoints(points_data), datetest: getCurrentDate() }
    await DBHelper.updateRecord(db_path, record);
    await readRecord(id);
  } else { console.warn('Отсутствует ID записи') }
}
/** Запись данный об объекте в БД */
export async function updateRecord(record: Object) {
  // обновление даты на текущую
  if (!record['datetest']) record['datetest'] = getCurrentDate();
  if (!record['daterecv']) record['daterecv'] = getCurrentDate();
  // если номер наряд-заказа изменен ->
  // удалить ID записи, для того чтобы добавилась новая
  if (get(RECORD)['ordernum'] !== record['ordernum']) record['id'] = undefined;
  let id = await DBHelper.updateRecord(db_path, record);
  console.log('Информации об объекте сохранена\n%o', record);
  // перечитать список и запись
  await readTestList();
  await readRecord(id);
}
/** Полная очистка данных о записи */
export function resetRecord() {
  RECORD.set({});
  CURRENT_SEALTYPE.set({});
};
/** Обновление пределов давления диафрагм */
function updateLimitsPress(sealtype) {
  let press_top = sealtype['limit_top']?.split(";").map(parseFloat);
  let press_btm = sealtype['limit_btm']?.split(";").map(parseFloat);
  let limit_top = press_top && { lo: press_top[0], hi: press_top[1] }
  let limit_btm = press_btm && { lo: press_btm[0], hi: press_btm[1] }
  LIMITS_PRESS.set([limit_top, limit_btm]);
}

