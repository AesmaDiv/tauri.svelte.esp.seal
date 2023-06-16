import { message } from "@tauri-apps/api/dialog";
import { get, writable, type Writable } from "svelte/store";
import { DBHelper} from "../database/DatabaseHelper";
import { getPointsFromRecord, serializePoints } from "../database/db_funcs";
import type { TestStates } from "./equipment";
import type { Limits } from "../lib/Chart/chart";
import { getCurrentDate } from "../funcs/shared";
import { SETTINGS } from "./settings";

export let TESTLIST: Writable<any[]> = writable([]);
export let RECORD: Writable<{}> = writable({});
export let SEALTYPES_LIST: Writable<any[]> = writable([]);
export let LIMITS_PRESS: Writable<Limits[]> = writable([]);
export let CURRENT_SEALTYPE: Writable<{}> = writable({});

let db_path = "";
SETTINGS.subscribe(async (settings) => {
  if (db_path = settings['db_path']) {
    await readSealtypes();
    await readTestList({select_first: true});
  }
});
CURRENT_SEALTYPE.subscribe(updateLimitsPress)

export type PressPoint = {
  time: number,
  press_top: number,
  press_btm: number,
}
export type PowerPoint = {
  time: number,
  power: number,
  temper: number,
  thrust?: number,
}
export let POINTS_PRESS: Writable<PressPoint[]> = writable([]);
export let POINTS_POWER: Writable<PowerPoint[]> = writable([]);

export async function readTestList({condition="ID > 0", select_first=false}={}) {
  let testlist: any[] = await DBHelper.readRecordList(db_path, `${condition} Order By ID Desc Limit 100`);
  TESTLIST.set(testlist);
  console.warn('TESTLIST updated');

  if (!select_first || !testlist.length) return;
  readRecord(testlist[0].id);
}
export async function readRecord(id: number) {
  // чтение записи из БД
  let record = await DBHelper.readRecord(db_path, id);
  RECORD.set(record);
  console.warn('RECORD updated\n%o', record);

  // получение информации о типоразмере
  let type_id : number = record['sealtype'];
  let sealtype : Object = get(SEALTYPES_LIST).find(item => item['id'] === type_id);
  CURRENT_SEALTYPE.set(sealtype);
  console.warn('CURRENT_SEALTYPE updated\n%o', sealtype);

  // получение точек испытаний
  let points = await getPointsFromRecord(record);
  POINTS_PRESS.set(points.test_press);
  POINTS_POWER.set(points.test_power);
  console.warn('POINTS updated\n%o', points);
}
export async function readSealtypes() {
  let types: any[] = await DBHelper.readSealTypes(db_path);
  SEALTYPES_LIST.set(types);
  console.warn('SEALTYPES updated');
}
export async function updatePoints(test_state: TestStates, points_data: PressPoint[] | PowerPoint[]) {
  if (!points_data) { console.warn('Отсутствуют данные для записи'); return; }
  let id : number;
  if (id = get(RECORD)['id']) {
    let record = { id, [test_state]: serializePoints(points_data), datetest: getCurrentDate() }
    await DBHelper.updateRecord(db_path, record);
    await readRecord(id);
  } else { console.warn('Отсутствует ID записи') }
}
export async function updateRecord(record: Object) {
  if (!record['datetest']) record['datetest'] = getCurrentDate();
  if (!record['daterecv']) record['daterecv'] = getCurrentDate();
  if (get(RECORD)['ordernum'] !== record['ordernum']) record['id'] = undefined;
  let id = await DBHelper.updateRecord(db_path, record);
  console.log('Сохранение информации об объекте', record)
  await readTestList();
  await readRecord(id);
}
export function resetRecord() {
  RECORD.set({});
  CURRENT_SEALTYPE.set({});
};
function updateLimitsPress(sealtype) {
  let press_top = sealtype['limit_top']?.split(";").map(parseFloat);
  let press_btm = sealtype['limit_btm']?.split(";").map(parseFloat);
  let limit_top = press_top && { lo: press_top[0], hi: press_top[1] }
  let limit_btm = press_btm && { lo: press_btm[0], hi: press_btm[1] }
  LIMITS_PRESS.set([limit_top, limit_btm]);
}

