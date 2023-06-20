import { get, writable, type Writable } from "svelte/store";
import { updatePoints as updateDbPoints} from "./database";
import { TestStates, AdamData, 
         type PressPoint, type PowerPoint,
         type IMarkerPress, type IMarkerPower } from "../shared/types";
import { isOtherTestRunning, startTestTimer } from "../testing/testing_common";


/** Данные с ADAM */
export let ADAM_DATA: Writable<AdamData> = writable(new AdamData());
/** Текущее испытание */
export let TEST_STATE: Writable<{[name: string]: boolean}> = writable({
  [TestStates.PRESS]: false,
  [TestStates.POWER]: false
});
/** Маркер графика давления диафрагм */
export let MARKER_PRESS: Writable<{}> = writable({} as IMarkerPress);
/** Маркер графика портребляемой мощности */
export let MARKER_POWER: Writable<{}> = writable({} as IMarkerPower);
/** Точки графика давления диафрагм */
export let POINTS_PRESS: Writable<PressPoint[]> = writable(undefined);
/** Точки графиков измерения потребляемой мощности */
export let POINTS_POWER: Writable<PowerPoint[]> = writable(undefined);


/** Переключение состояния испытаний */
let test_timer : NodeJS.Timer;
export function switchTest(test_state: TestStates) {
  let state = false;
  // если идёт другое испытание ->
  // выход из функции
  if (isOtherTestRunning(test_state)) return;
  // изменить состояние испытания
  TEST_STATE.update(prev => {
    state = (prev[test_state] = !prev[test_state]);
    return prev;
  });
  // если это начало теста ->
  // создание и запуск таймера
  if (state) {
    resetTest(test_state);
    // при вызове функции создания и запуска таймера передаётся колбэк функция,
    // которая будет вызвана по завершению его работы
    test_timer = startTestTimer(test_state, switchTest);
  // если это остановка теста ->
  // остановка и очистка таймера
  } else if (test_timer) {
    clearInterval(test_timer);
    test_timer = undefined;
  }
}
/** Очистка данных об испытании */
export function resetTest(test_state: TestStates) {
  console.log("Очистка данных об испытании")
  ADAM_DATA.set(new AdamData());
  ({
    [TestStates.IDLE] : () => {},
    [TestStates.PRESS]: () => POINTS_PRESS.set(undefined),
    [TestStates.POWER]: () => POINTS_POWER.set(undefined),
  })[test_state]();
}
/** Обновление точек графика испытания в БД */
export function updatePoints(test_state: TestStates) {
  let points = {
    [TestStates.PRESS]: POINTS_PRESS,
    [TestStates.POWER]: POINTS_POWER,
  }[test_state];
  updateDbPoints(test_state, get(points));
  points.set(undefined);
}

ADAM_DATA.subscribe(data => {
  // при изменении данных с ADAM ->
  let state = get(TEST_STATE);
  // обновить положение маркеров графиков
  MARKER_PRESS.set({
    press_top: { x: data.time, y: data.press_top},
    press_btm: { x: data.time, y: data.press_btm},
  });
  MARKER_POWER.set({
    power : { x: data.time, y: data.power},
    temper: { x: data.time, y: data.temper},
  });
  // при запущеном испытании ->
  // добавить точки графика
  state[TestStates.PRESS] && POINTS_PRESS.update(prev => {
    !prev && (prev = []);
    prev.push({
      time : data.time,
      press_top  : data.press_top,
      press_btm  : data.press_btm
    });
    return prev;
  });
  state[TestStates.POWER] && POINTS_POWER.update(prev => {
    !prev && (prev = []);
    prev.push({
      time : data.time,
      power      : data.power,
      temper     : data.temper});
    return prev;
  });
});
