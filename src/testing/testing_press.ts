import { get } from "svelte/store";
import { type Sensors, TestStates, } from "../shared/types";
import { SETTINGS } from "../stores/settings";
import { TEST_STATE, POINTS_PRESS, resetPoints, updateTestPoints } from "../stores/testing";
import { NotifierKind, showMessage } from "../lib/Notifier/notifier";


let test_tick = 0;
let test_timer : NodeJS.Timer;
const NAME = TestStates.PRESS;
export function switchTest() {
  // изменить состояние испытания
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
    }, get(SETTINGS).test.test_press.pulling_rate);
  // если это окончание ->
  } else {
    // сброс и уничтожение таймера
    clearTimeout(test_timer);
    test_timer = undefined;
  }
}
function doTest() {
  let result = true;
  switch (true) {
    // case (test_tick === 0):
    //   console.log("Step 0");
    //   break;
    // case (test_tick < 20):
    //   console.log("Waiting", test_tick);
    //   break;
    // case (test_tick === 2):
    //   console.log("Step 2");
    //   break;
    case (test_tick < 3000):
      result = updateTestPoints(NAME, addPoint);
      if (!result) showMessage("Испытание закончено", NotifierKind.SUCCESS);
      break;
    case (test_tick === 3000):
      result = false;
  }
  test_tick += 1;

  return result;
}

function addPoint(data: Sensors) {
  POINTS_PRESS.update(points => {
    if (!points) points = [];
    points.push({
      time      : data.time,
      press_top : data.press_top,
      press_btm : data.press_btm
    });
    return points;
  })
}