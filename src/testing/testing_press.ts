import { get } from "svelte/store";
import { SETTINGS } from "../stores/settings";
import { ADAM_DATA, } from "../stores/equipment";
import { POINTS_PRESS } from "../stores/testing";
import type { Sensors, ITiming, } from "../shared/types";
import { NotifierKind, showMessage } from "../lib/Notifier/notifier";


export function doTest() {
  const timings : ITiming = get(SETTINGS).test.test_press;
  const max = timings.points_count;
  const rate = timings.pulling_rate;
  const result = updatePoints(max, rate);
  if (!result) showMessage("Испытание закончено", NotifierKind.SUCCESS);
  return result;
}
function updatePoints(max: number, rate: number) : boolean {
  let test_time = 0;
  ADAM_DATA.update(data => {
    data.time += rate / 1000;
    test_time = +(data.time).toFixed(2);
    if (Number.isInteger(test_time)) addPoint(data);

    return data;
  });
  return test_time < max;
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