<script lang="ts">
  import TestControls from "./TestControls.svelte";
  import TestChart from "./TestChart.svelte";

  import { TestStates, MARKER_PRESS, POINTS_PRESS as NewPoints } from "../stores/equipment";
  import { LIMITS_PRESS, POINTS_PRESS as OldPoints } from "../stores/database";

  import { HEADERS_CHARTS } from "../configs/cfg_localization";
  import { DATANAMES } from "../configs/cfg_press";
  import { AXIES } from "../configs/cfg_press";

  const eng = false;
  const names = {x: 'time', y1: 'press_top', y2: 'press_btm'};
  const titles = HEADERS_CHARTS[eng].press;
</script>

<div class="root">
  <TestControls state={TestStates.PRESS} fields={DATANAMES} style="width: 300px;"/>
  <TestChart {titles} axies={AXIES} points={$NewPoints || $OldPoints} limits={$LIMITS_PRESS} {names} markers={$MARKER_PRESS}/>
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