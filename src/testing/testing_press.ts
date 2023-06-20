import { get } from "svelte/store";
import { SETTINGS } from "../stores/settings";
import { ADAM_DATA } from "../stores/equipment";
import type { AdamData, ISettings, PressPoint } from "../shared/types";


export function doTest() {
  const settings : ISettings = get(SETTINGS);
  return generate(settings.test.test_press.points_count)
}
function generate(max: number) : boolean {
  let old_data : AdamData = get(ADAM_DATA);
  let new_data : PressPoint = {
    time : old_data.time + 1,
    press_top  : old_data.press_top + (0.5 - Math.random()),
    press_btm  : old_data.press_btm + (0.5 - Math.random()),
  };
  if (new_data.press_top > 2.5) { new_data.press_top = 2.5}
  else if (new_data.press_top < 0) { new_data.press_top = 0}
  if (new_data.press_btm > 3.5) { new_data.press_btm = 3.5}
  else if (new_data.press_btm < 0) { new_data.press_btm = 0}

  ADAM_DATA.update(prev => { return {...prev, ...new_data } });

  return new_data.time < max;
}