<script lang="ts">
  import TestControls from "./TestControls.svelte";
  import TestChart from "./TestChart.svelte";
  import { TestStates } from "../shared/types";
  import { AXIS_POWER, MARKER_POWER, POINTS_POWER as NewPoints } from "../stores/testing";
  import { POINTS_POWER as OldPoints } from "../stores/database";
  import { setThrust } from "../stores/equipment";
  import { DATANAMES } from "../configs/cfg_power";
  import { HEADERS_CHARTS } from "../configs/cfg_localization";

  const eng = false;
  const names = {x: 'time', y1: 'power', y2: 'temper'};
  const titles = HEADERS_CHARTS[eng].power;

  let thrust = 0;
  function onChange(event: Event) {
    let input = event.target as HTMLInputElement;
    thrust = input.valueAsNumber;
    if (event.type === 'change') setThrust(thrust);
  }
</script>

<div class="root">
  <TestControls test_state={TestStates.POWER} fields={DATANAMES} style="width: 300px;">
    <div class="thrust-controls">
      <label for="thrust">Нагрузка, кгс: {thrust}</label>
      <input class="thrust" type="range" min="0" max="800" list="markers" value={thrust}
        on:change={onChange} on:input={onChange}/>
      <datalist id="markers">
        <option value="0"   label="0">0</option>
        <option value="50"  label="50">50</option>
        <option value="100" label="100"></option>
        <option value="200" label="200"></option>
        <option value="400" label="400"></option>
        <option value="800" label="800"></option>
      </datalist>
    </div>
  </TestControls>
  <TestChart {titles} axies={$AXIS_POWER} points={$NewPoints || $OldPoints} {names} markers={$MARKER_POWER}/>
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
  .thrust-controls {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 3em;
  }
  .thrust {
    width: 100%;
  }
</style>