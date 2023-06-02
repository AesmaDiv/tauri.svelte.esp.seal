<script lang="ts">
  import TestControls from "./TestControls.svelte";
  import TestChart from "./TestChart.svelte";
  import { TestStates, MARKER_PRESS, POINTS_PRESS as NewPoints } from "../stores/equipment";
  import { POINTS_PRESS as OldPoints } from "../stores/database";
  import { DATANAMES } from "../configs/cfg_press";
  import { CURRENT_SEALTYPE } from "../stores/database";
  import { AXIES } from "../configs/cfg_press";

  const limits = {top: undefined, btm: undefined};
  const names = {x: 'time', y1: 'press_top', y2: 'press_btm'};
  CURRENT_SEALTYPE.subscribe(sealtype => {
    limits.top = sealtype['limit_top']?.split(";").map(parseFloat);
    limits.btm = sealtype['limit_btm']?.split(";").map(parseFloat);
  });

</script>

<div class="root">
  <TestControls state={TestStates.PRESS} fields={DATANAMES} style="width: 300px;"/>
  <TestChart axies={AXIES} points={$NewPoints || $OldPoints} {names} markers={$MARKER_PRESS}/>
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 1em;
    border: 1px solid;
  }
</style>