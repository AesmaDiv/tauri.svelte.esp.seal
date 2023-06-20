import { get } from "svelte/store";
import { SETTINGS } from "../stores/settings";
import type { ISettings } from "../shared/types";
import { ADAM_DATA } from "../stores/equipment";


export function doTest() {
  const settings : ISettings = get(SETTINGS);
  return generate(settings.test.test_power.points_count);
}
function generate(max: number) : boolean {
  let old_data = get(ADAM_DATA);
  let new_data = {
    time : old_data.time + 1,
    power      : old_data.power + (0.1 - Math.random()),
    temper     : old_data.temper + (1 - Math.random()),
  };
  if (new_data.power > 0.6) { new_data.power = 0.6}
  else if (new_data.power < 0) { new_data.power = 0}
  if (new_data.temper > 150) { new_data.temper = 150}
  else if (new_data.temper < 0) { new_data.temper = 0}

  ADAM_DATA.update(prev => { return {...prev, ...new_data } });

  return new_data.time < max;
}