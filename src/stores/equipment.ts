import { type Writable, writable, get } from "svelte/store";
import { Sensors, SensorsBuffers, type IAdamData, VBuffer } from "../shared/types";
import { SETTINGS } from "./settings";
import { NotifierKind, showMessage } from "../lib/Notifier/notifier";
import { invoke } from "@tauri-apps/api/tauri";


/** Состояние чтения с ADAM */
export let ADAM_READING: Writable<boolean> = writable(false);
/** Данные с ADAM */
export let ADAM_DATA:  Writable<Sensors>  = writable(new Sensors());


/** таймер опроса Adam */
let tmr_adam : NodeJS.Timer;
/** Переключение опроса Adam */
export function switchAdamReading() {
  const rate = get(SETTINGS).adam.pulling_rate;
  if (!tmr_adam) tmr_adam = setInterval(() => updateAdamValues(), rate);
  else {
    clearInterval(tmr_adam);
    tmr_adam = undefined;
  }

  showMessage(
    !!tmr_adam ? "Опрос ADAM запущен" : "Опрос ADAM прекращён",
    !!tmr_adam ? NotifierKind.NORMAL : NotifierKind.WARNING,
  );
  ADAM_READING.set(!!tmr_adam);
}

/** Буфферы для усреднения значений с Adam */
const buffers = new SensorsBuffers(5);
/** Обновление данных с Adam */
function updateAdamValues() {
  updateBuffers()
  .then(() => ADAM_DATA.update(updateData))
  .catch(reason => showMessage(reason, NotifierKind.ERROR));
}
/** Обновление буфферов значений с Adam */
async function updateBuffers() {
  const settings = get(SETTINGS);
  let adam_data : IAdamData = await invoke("read_adam", { address: settings.adam.ip });
  if (!adam_data.analog && !adam_data.digital) throw "Ошибка подключения к ADAM";

  for(const [key, item] of Object.entries(settings.adam.analog)) {
    buffers[key].add(
      (adam_data.analog.slot[item.slot][item.channel] - item.offset) *
      item.v_range / item.d_range *
      item.coeff
    )
  }
}
/** Обновление усреднённых значений */
function updateData(sensors: Sensors) {
  for (const [key, buff] of Object.entries(buffers)) {
    sensors[key] = (buff as VBuffer).getAverage();
  }
  sensors.power = sensors.torque * sensors.speed * 5252;

  return sensors;
}