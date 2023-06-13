import { ACTIVE_TEST } from "../configs/cfg_hardware";
import { switchTestingPress } from "./testing_press";


export function switchTesting(tracked_state, status, init_values, dispatch) {
  console.log(tracked_state);
  switch (tracked_state) {
    case ACTIVE_TEST.test_press: {
      switchTestingPress(status, dispatch, init_values[tracked_state]);
    } break;
    case ACTIVE_TEST.test_power: {
      // console.log(`${state_str} power consumption test`);
    } break;
  }
  console.log(status);
}
