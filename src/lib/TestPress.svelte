<script lang="ts">
  import Chart from "./Chart/Chart.svelte";
  import TestControls from "./TestControls.svelte";
  import { POINTS_PRESS as OldPoints } from "../stores/database";
  import { TestStates, MARKER_PRESS, POINTS_PRESS as NewPoints } from "../stores/equipment";
  import { DATANAMES, AXIES } from "../configs/cfg_press";
  import { CURRENT_SEALTYPE } from "../stores/database";

  const limits = {top: undefined, btm: undefined};
  CURRENT_SEALTYPE.subscribe(sealtype => {
    limits.top = sealtype['limit_top']?.split(";").map(parseFloat);
    limits.btm = sealtype['limit_btm']?.split(";").map(parseFloat);
  });

  $: data = (() => {
    let src = $NewPoints ?? $OldPoints;
    let points = src.reduce((obj, val) => {
      obj['press_top'].push({x: val.time, y: val.press_top});
      obj['press_btm'].push({x: val.time, y: val.press_btm});
      return obj;
    }, { press_top: [], press_btm: [] });
    return points;
  })();
</script>

<div class="root">
  <div class="controls">
    <TestControls state={TestStates.PRESS} fields={DATANAMES}/>
  </div>
  <div class="charts">
    <Chart axis_x={AXIES.time} axis_y={AXIES.top} 
      data={data.press_top} limits={limits.top}
      stroke='blue' marker={$MARKER_PRESS['press_top']}/>
    <Chart axis_x={AXIES.time} axis_y={AXIES.btm} 
      data={data.press_btm} limits={limits.btm}
      stroke='green' marker={$MARKER_PRESS['press_btm']}/>
  </div>
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
  .controls {
    min-width: 200px;
    max-width: 200px;
  }
  .charts {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

</style>