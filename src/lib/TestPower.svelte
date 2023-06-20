<script lang="ts">
  import TestControls from "./TestControls.svelte";
  import TestChart from "./TestChart.svelte";
  import { TestStates } from "../shared/types";
  import { MARKER_POWER, POINTS_POWER as NewPoints } from "../stores/equipment";
  import { POINTS_POWER as OldPoints } from "../stores/database";
  import { DATANAMES, AXIES } from "../configs/cfg_power";
  import { HEADERS_CHARTS } from "../configs/cfg_localization";

  const eng = false;
  const names = {x: 'time', y1: 'power', y2: 'temper'};
  const titles = HEADERS_CHARTS[eng].power;
</script>

<div class="root">
  <TestControls test_state={TestStates.POWER} fields={DATANAMES} style="width: 300px;"/>
  <TestChart {titles} axies={AXIES} points={$NewPoints || $OldPoints} {names} markers={$MARKER_POWER}/>
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