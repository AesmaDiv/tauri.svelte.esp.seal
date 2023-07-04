import { ask } from "@tauri-apps/api/dialog";
import { type Writable, writable, get } from "svelte/store";
import { SETTINGS } from "./settings";
import { updatePoints as updateDbPoints} from "./database";
import { SENSORS, ADAM_READING } from "./equipment";
import type { IMarkerPower, IMarkerPress, PowerPoint, PressPoint, ITiming } from "../shared/types";
import { TestStates } from "../shared/types";
import type { AxisInfo } from "../lib/Chart/chart";
import { showMessage, NotifierKind } from "../lib/Notifier/notifier";
import { switchTest as switchPressTest } from "../testing/testing_press";
import { switchTest as switchPowerTest } from "../testing/testing_power";
import { AXIES as AXIES_PRESS_INIT } from "../configs/cfg_press";
import { AXIES as AXIES_POWER_INIT } from "../configs/cfg_power";


/** Текущее испытание */
export let TEST_STATE: Writable<TestStates> = writable(TestStates.IDLE);
/** Маркер графика давления диафрагм */
export let MARKER_PRESS: Writable<{}> = writable({} as IMarkerPress);
/** Маркер графика портребляемой мощности */
export let MARKER_POWER: Writable<{}> = writable({} as IMarkerPower);
/** Точки графика давления диафрагм c ADAM */
export let POINTS_PRESS: Writable<PressPoint[]> = writable(undefined);
/** Точки графиков измерения потребляемой мощности c ADAM */
export let POINTS_POWER: Writable<PowerPoint[]> = writable(undefined);
/** Параметры осей графика давления диафрагм */
export let AXIS_PRESS: Writable<{[name: string]: AxisInfo}> = writable(AXIES_PRESS_INIT);
/** Параметры осей графика потребляемой мощности */
export let AXIS_POWER: Writable<{[name: string]: AxisInfo}> = writable(AXIES_POWER_INIT);


/** Проверка состояния испытания */
export function isTestRunning() : boolean {
  return get(TEST_STATE) !== TestStates.IDLE;
}
/** Проверка состояния другого испытания */
export function isOtherTestRunning (test_state: TestStates) {
  return isTestRunning() && get(TEST_STATE) !== test_state;
  // ![TestStates.IDLE, test_state].includes(get(TEST_STATE))
}
/** Проверка несохраненных точек */
export async function haveUnsavedData() {
    if (get(POINTS_PRESS) || get(POINTS_POWER)) {
      let answer = await ask(
      "Имеются несохраненные данные.\n" +
      "Вы уверены, что хотите выбрать другую запись?",
      "Внимание");
      if (answer) resetPoints();
      return !answer;
    }
    return false;
}
/** Очистка точек графика испытания */
export function resetPoints(test_state: TestStates = TestStates.IDLE) {
  // если тест для которого нужно очистить точки не указан ->
  if (test_state === TestStates.IDLE) {
    // очистить все несохраненные точки
    resetPoints(TestStates.PRESS);
    resetPoints(TestStates.POWER);
    return;
  };
  console.log("Очистка точек испытания %o", test_state)
  // сброс значения пройденого времени испытания
  SENSORS.update(data => { data.time = 0; return data });
  let points = ({
    [TestStates.PRESS]: POINTS_PRESS,
    [TestStates.POWER]: POINTS_POWER,
  })[test_state];
  points.set(undefined);
}
/** Сохранение точек графика испытания в БД */
export function savePoints(test_state: TestStates) {
  if (test_state === TestStates.IDLE) return;
  let points = ({
    [TestStates.PRESS]: get(POINTS_PRESS),
    [TestStates.POWER]: get(POINTS_POWER),
  })[test_state];
  updateDbPoints(test_state, points);
  resetPoints(test_state);
}
/** Добавление точки испытания  */
export function updateTestPoints(test_state: TestStates, addFunction: Function) : boolean {
  const timings : ITiming = get(SETTINGS).test[test_state];
  let test_time = 0;
  SENSORS.update(data => {
    data.time += timings.pulling_rate / 1000;
    test_time = +(data.time).toFixed(2);
    if (Number.isInteger(test_time)) addFunction(data);

    return data;
  });
  return test_time < timings.points_count;
}
/** Переключение состояния испытаний */
export function switchTest(test_state: TestStates) {
  if (!get(ADAM_READING)) {
    showMessage("Не запущен опрос Adam", NotifierKind.ERROR);
    return;
  }
  // если идёт другое испытание ->
  // выход из функции
  if (isOtherTestRunning(test_state)) {
    showMessage("Выполняется другое испытание", NotifierKind.ERROR);
    return;
  }
  // запуск/остановка испытания
  ({
    [TestStates.PRESS] : switchPressTest,
    [TestStates.POWER] : switchPowerTest,
  })[test_state]();
}


// при изменении средних значений с ADAM ->
SENSORS.subscribe(data => {
  // изменить маркер времени только для активного испытания
  const test = get(TEST_STATE);
  const press_time = test === TestStates.PRESS ? data.time : 0;
  const power_time = test === TestStates.POWER ? data.time : 0;
  // обновить положение маркеров графиков
  MARKER_PRESS.set({
    press_top: { x: press_time, y: data.press_top},
    press_btm: { x: press_time, y: data.press_btm},
  });
  MARKER_POWER.set({
    power : { x: power_time, y: data.power},
    temper: { x: power_time, y: data.temper},
  });
});

// при изменении настроек ->
SETTINGS.subscribe(settings => {
  if (!settings.test) return;
  // обновить параметры оси времени для графиков испытаний
  AXIS_PRESS.update(axis => {
    axis.time = { minimum: 0, maximum: settings.test.test_press.duration, ticks: 6, coef: 1/60 };
    return axis;
  });
  AXIS_POWER.update(axis => {
    axis.time = { minimum: 0, maximum: settings.test.test_power.duration, ticks: 5, coef: 1/60 };
    return axis;
  });
})