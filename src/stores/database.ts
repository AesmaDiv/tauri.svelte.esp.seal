import { get, writable, type Writable } from "svelte/store";
import { DBHelper} from "../database/DatabaseHelper";
import { getPointsFromRecord, serializePoints } from "../database/db_funcs";
import type { TestStates } from "./equipment";
import { getCurrentDate } from "../funcs/shared";

export let TESTLIST: Writable<any[]> = writable([]);
export let RECORD: Writable<{}> = writable({});
export let SEALTYPES_LIST: Writable<any[]> = writable([]);
export let CURRENT_SEALTYPE: Writable<{}> = writable({});

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


export async function readTestList() {
  let testlist: any[] = await DBHelper.readRecordList(' ID > 0 Order By ID Desc');
  TESTLIST.set(testlist);
  console.warn('TESTLIST updated');
}
export async function readRecord(id: number) {
  // чтение записи из БД
  let record = await DBHelper.readRecord(id);
  RECORD.set(record);
  console.warn('RECORD updated', record);

  // получение информации о типоразмере
  let type_id : number = record['sealtype'];
  let sealtype : Object = get(SEALTYPES_LIST).find(item => item['id'] === type_id);
  CURRENT_SEALTYPE.set(sealtype);
  console.warn('CURRENT_SEALTYPE updated', sealtype);

  // получение точек испытаний
  let points = await getPointsFromRecord(record);
  POINTS_PRESS.set(points.test_press);
  POINTS_POWER.set(points.test_power);
  console.warn('POINTS updated', points);
}
export async function readSealtypes() {
  let types: any[] = await DBHelper.readSealTypes();
  SEALTYPES_LIST.set(types);
  console.warn('SEALTYPES updated');
}
export async function updatePoints(test_state: TestStates, points_data: PressPoint[] | PowerPoint[]) {
  if (!points_data) { console.warn('Отсутствуют данные для записи'); return; }
  let id : number;
  if (id = get(RECORD)['id']) {
    let record = { id, [test_state]: serializePoints(points_data), datetest: getCurrentDate() }
    await DBHelper.updateRecord(record);
    await readRecord(id);
  } else { console.warn('Отсутствует ID записи') }
}
export async function updateRecord(record: Object) {
  if (!record['datetest']) record['datetest'] = getCurrentDate();
  if (!record['daterecv']) record['daterecv'] = getCurrentDate();
  await DBHelper.updateRecord(record);
  console.log('Сохранение информации об объекте', record)
  await readTestList();
}
export function resetRecord() {
  RECORD.set({});
  CURRENT_SEALTYPE.set({});
};

