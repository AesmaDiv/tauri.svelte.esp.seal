import { ask } from "@tauri-apps/api/dialog";
import { type Writable, writable, get } from "svelte/store";
import { SETTINGS } from "./settings";
import { updatePoints as updateDbPoints} from "./database";
import { ADAM_DATA, ADAM_READING } from "./equipment";
import type { IMarkerPower, IMarkerPress, PowerPoint, PressPoint, ITiming, ISettings } from "../shared/types";
import { TestStates } from "../shared/types";
import { doTest as doPressTest } from "../testing/testing_press";
import { doTest as doPowerTest } from "../testing/testing_power";
import { showMessage, NotifierKind } from "../lib/Notifier/notifier";


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
  ADAM_DATA.update(data => { data.time = 0; return data });
  let points = ({
    [TestStates.PRESS]: POINTS_PRESS,
    [TestStates.POWER]: POINTS_POWER,
  })[test_state];
  points.set(undefined);
}
/** Обновление точек графика испытания в БД */
export function updatePoints(test_state: TestStates) {
  if (test_state === TestStates.IDLE) return;
  let points = ({
    [TestStates.PRESS]: get(POINTS_PRESS),
    [TestStates.POWER]: get(POINTS_POWER),
  })[test_state];
  updateDbPoints(test_state, points);
  resetPoints(test_state);
}
/** Переключение состояния испытаний */
let test_timer : NodeJS.Timer;
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
  // изменить состояние испытания
  let state = false;
  TEST_STATE.update(prev => {
    // если не запущено ни одно испытание ->
    // запускаем указанное
    state = prev === TestStates.IDLE;
    return prev === test_state ? TestStates.IDLE : test_state;
  });
  // если это начало теста ->
  // создание и запуск таймера
  if (state) {
    resetPoints(test_state);
    // при вызове функции создания и запуска таймера передаётся колбэк функция,
    // которая будет вызвана по завершению его работы
    const timings : ITiming = get(SETTINGS).test[test_state];
    test_timer = setInterval(() => {
      !({
        [TestStates.PRESS] : doPressTest,
        [TestStates.POWER] : doPowerTest,
      })[test_state](timings.points_count) && switchTest(test_state);
    }, timings.pulling_rate);
  // если это остановка теста ->
  // остановка и очистка таймера
  } else if (test_timer) {
    clearInterval(test_timer);
    test_timer = undefined;
  }
}

// при изменении средних значений с ADAM ->
ADAM_DATA.subscribe(data => {
  // изменить маркер времени только для активного испытания
  const test = get(TEST_STATE);
  const press_time = test === TestStates.PRESS ? data.time : 0;
  const power_time = test === TestStates.POWER ? data.time : 0
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