<script lang="ts">
  import TestControls from "./TestControls.svelte";
  import TestChart from "./TestChart.svelte";
  import { TestStates, MARKER_POWER, POINTS_POWER as NewPoints } from "../stores/equipment";
  import { POINTS_POWER as OldPoints } from "../stores/database";
  import { DATANAMES, AXIES } from "../configs/cfg_power";


  const names = {x: 'time', y1: 'power', y2: 'temper'};
</script>

<div class="root">
  <TestControls state={TestStates.POWER} fields={DATANAMES} style="width: 300px;"/>
  <TestChart axies={AXIES} points={$NewPoints || $OldPoints} {names} markers={$MARKER_POWER}/>
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
</style>