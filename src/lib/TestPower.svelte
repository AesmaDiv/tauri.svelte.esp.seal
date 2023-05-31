<script lang="ts">
  import Chart from "./Chart/Chart.svelte";
  import TestControls from "./TestControls.svelte";
  import { POINTS_POWER as OldPoints } from "../stores/database";
  import { TestStates, MARKER_PRESS, POINTS_POWER as NewPoints } from "../stores/equipment";
  import { DATANAMES, AXIES } from "../configs/cfg_power";


  const axies = {
    time: { min: 0, max: 180, div: 6 },
    power: { min: 0, max: 2.5, div: 5}, 
    temper: { min: 0, max: 120, div: 4}
  };

  $: data = (() => {
    let src = $NewPoints ?? $OldPoints;
    let points = src.reduce((obj, val) => {
      obj['power'].push({x: val.time, y: val.power});
      obj['temper'].push({x: val.time, y: val.temper});
      return obj;
    }, { power: [], temper: [] });
    return points;
  })();
</script>

<div class="root">
  <div class="controls">
    <TestControls state={TestStates.POWER} fields={DATANAMES}/>
  </div>
  <div class="charts">
    <Chart data={data.power} axis_x={AXIES.time} axis_y={AXIES.power} stroke='blue' marker={$MARKER_PRESS['press_top']}/>
    <Chart data={data.temper} axis_x={AXIES.time} axis_y={AXIES.temper} stroke='green' marker={$MARKER_PRESS['press_btm']}/>
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