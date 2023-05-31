import { get, writable, type Writable } from "svelte/store";
import { type PressPoint, type PowerPoint, updatePoints as updateDbPoints} from "./database";

export type AdamData = {
  time: number,
  press_sys : number,
  press_top : number,
  press_btm : number,

  speed     : number,
  torque    : number,
  temper    : number,
  power     : number,
};
const INITIAL: AdamData = {
  time: 0,
  press_sys: 0,
  press_top: 0,
  press_btm: 0,

  speed    : 0,
  torque   : 0,
  temper   : 0,
  power    : 0,
};
export let ADAM_DATA: Writable<AdamData> = writable(INITIAL);

export enum TestStates {
  IDLE  = '',
  PRESS = 'test_press',
  POWER = 'test_power',
}
export let TEST_STATE: Writable<{[name: string]: boolean}> = writable({
  [TestStates.PRESS]: false,
  [TestStates.POWER]: false
});

export let MARKER_PRESS: Writable<{}> = writable({press_top: {x: 25, y: 1}, press_btm: {x: 35, y: 2}});
export let MARKER_POWER: Writable<{}> = writable({power: {x: 25, y: 1}, temper: {x: 35, y: 2}});
export let POINTS_PRESS: Writable<PressPoint[]> = writable(undefined);
export let POINTS_POWER: Writable<PowerPoint[]> = writable(undefined);


let test_timer : NodeJS.Timer;
export function switchTest(test_state: TestStates) {
  let state = false;
  TEST_STATE.update(prev => {
    state = (prev[test_state] = !prev[test_state]);
    return prev;
  });
  if (state) {
    resetTest(test_state);
    test_timer = setInterval(() => {
      !generate(test_state) && switchTest(test_state);
      console.log("Timer tick");
    }, 1000 / 30);
    console.log('Timer started');
  } else if (test_timer) {
    clearInterval(test_timer);
    test_timer = undefined;
    console.log('Timer stopped');
  }
}
export function resetTest(test_state: TestStates) {
  console.log("Сброс данных испытания")
  ADAM_DATA.set(INITIAL);
  ({
    [TestStates.IDLE] : () => {},
    [TestStates.PRESS]: () => POINTS_PRESS.set(undefined),
    [TestStates.POWER]: () => POINTS_POWER.set(undefined),
  })[test_state]();
}
export function updatePoints(test_state: TestStates) {
  let points = {
    [TestStates.PRESS]: POINTS_PRESS,
    [TestStates.POWER]: POINTS_POWER,
  }[test_state];
  updateDbPoints(test_state, get(points));
  points.set(undefined);
}

ADAM_DATA.subscribe(data => {
  let state = get(TEST_STATE);
  MARKER_PRESS.set({
    press_top: { x: data.time, y: data.press_top },
    press_btm: { x: data.time, y: data.press_btm },
  });
  MARKER_POWER.set({
    power : { x: data.time, y: data.power },
    temper: { x: data.time, y: data.temper },
  });

  state[TestStates.PRESS] && POINTS_PRESS.update(prev => {
    !prev && (prev = []);
    prev.push({time: data.time, press_top: data.press_top, press_btm: data.press_btm});
    return prev;
  });
  state[TestStates.POWER] && POINTS_POWER.update(prev => {
    !prev && (prev = []);
    prev.push({time: data.time, power: data.power, temper: data.temper});
    return prev;
  });
});

function generate(test_state: TestStates) : boolean {
  return ({
    [TestStates.IDLE] : () => false,
    [TestStates.PRESS]: () => generatePress(180),
    [TestStates.POWER]: () => generatePower(25),
  })[test_state]();
}
function generatePress(max: number) : boolean {
  console.log("Generating press data");
  let old_data = get(ADAM_DATA);
  let new_data = {
    time: old_data.time + 1,
    press_top: old_data.press_top + (0.5 - Math.random()),
    press_btm: old_data.press_btm + (0.5 - Math.random()),
  };
  if (new_data.press_top > 2.5) { new_data.press_top = 2.5}
  else if (new_data.press_top < 0) { new_data.press_top = 0}
  if (new_data.press_btm > 3.5) { new_data.press_btm = 3.5}
  else if (new_data.press_btm < 0) { new_data.press_btm = 0}

  ADAM_DATA.update(prev => { return {...prev, ...new_data } });

  return new_data.time < max;
}
function generatePower(max: number) : boolean {
  console.log("Generating power data");
  let old_data = get(ADAM_DATA);
  let new_data = {
    time: old_data.time + 1,
    power: old_data.power + (0.1 - Math.random()),
    temper: old_data.temper + (1 - Math.random()),
  };
  if (new_data.power > 0.6) { new_data.power = 0.6}
  else if (new_data.power < 0) { new_data.power = 0}
  if (new_data.temper > 150) { new_data.temper = 150}
  else if (new_data.temper < 0) { new_data.temper = 0}

  ADAM_DATA.update(prev => { return {...prev, ...new_data } });

  return new_data.time < max;
}



