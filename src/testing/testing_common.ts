import { get } from "svelte/store";
import { SETTINGS } from "../stores/settings";
import { TEST_STATE } from "../stores/equipment";
import { TestStates, type ITiming } from "../shared/types";
import { doTest as doPressTest } from "./testing_press";
import { doTest as doPowerTest } from "./testing_power";



/** Проверка состояния другого испытания */
export const isOtherTestRunning = (test_state: TestStates) => get(TEST_STATE)[
  test_state === TestStates.POWER ?
  TestStates.PRESS :
  TestStates.POWER
];

export function startTestTimer(test_state: TestStates, callback: Function) {
  const settings : ITiming = get(SETTINGS).test[test_state];
  let tmr : NodeJS.Timer = setInterval(() => {
    !({
      [TestStates.PRESS] : doPressTest,
      [TestStates.POWER] : doPowerTest,
    })[test_state](settings.points_count) && callback(test_state);
  }, settings.pulling_rate);
  return tmr;
}