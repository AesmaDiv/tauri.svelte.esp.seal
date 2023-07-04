import { get } from "svelte/store";
import { type Sensors, TestStates, } from "../shared/types";
import { SETTINGS } from "../stores/settings";
import { setMotorState} from "../stores/equipment";
import { TEST_STATE, POINTS_POWER, resetPoints, updateTestPoints } from "../stores/testing";
import { NotifierKind, showMessage } from "../lib/Notifier/notifier";


let test_tick = 0;
let test_timer : NodeJS.Timer;
const NAME = TestStates.POWER;
export function switchTest() {
  let state = false;
  TEST_STATE.update(prev => {
    // получить состояние испытания
    state = prev === TestStates.IDLE;
    // изменить состояние испытания
    return prev === NAME ? TestStates.IDLE : NAME;
  });
  // если это начало ->
  if (state) {
    resetPoints(NAME);
    // сброс счётчика и старт таймера
    test_tick = 0;
    test_timer = setInterval(() => {
      !doTest() && switchTest();
    }, get(SETTINGS).test.test_power.pulling_rate);
  // если это окончание ->
  } else {
    // сброс и уничтожение таймера
    clearTimeout(test_timer);
    test_timer = undefined;
    // остановка двигателя
    setMotorState(false);
  }
}
/** Выполнение тика испытания */
function doTest() {
  let result = true;
  switch (true) {
    case (test_tick === 1):
      // запуск двигателя
      setMotorState(true);
      break;
    case (test_tick > 10):
      // перкращение испытания
      result = false;
      break;
    case (test_tick > 1):
      result = updateTestPoints(NAME, addPoint);
      if (!result) showMessage("Испытание закончено", NotifierKind.SUCCESS);
      break;
  }
  test_tick += 1;

  return result;
}

function addPoint(data: Sensors) {
  POINTS_POWER.update(points => {
    if (!points) points = [];
    points.push({
      time   : data.time,
      power  : data.power,
      temper : data.temper
    });
    return points;
  });
}