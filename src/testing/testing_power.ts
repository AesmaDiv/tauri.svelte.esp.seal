import { get } from "svelte/store";
import { SETTINGS } from "../stores/settings";
import type { Sensors, ISettings } from "../shared/types";
import { ADAM_DATA, } from "../stores/equipment";
import { POINTS_POWER } from "../stores/testing";


/** Выполнение тика испытания */
export function doTest() {
  const settings : ISettings = get(SETTINGS);
  return updatePoints(settings.test.test_power.points_count);
}
/** Тик фиксации точки  */
function updatePoints(max: number) : boolean {
  let test_time = 0;
  ADAM_DATA.update(data => {
    data.time += 1;
    test_time = data.time;
    addPoint(data);

    return data;
  });

  return test_time < max;
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