<script lang="ts">
  import Chart from "./Chart/Chart.svelte";
  import { pointsToChart } from "../database/db_funcs";

  export let axies = {}
  export let names: {x: string, y1: string, y2: string} = { x:'', y1:'', y2:'' }
  export let markers = {}

  $: data = (() => {
    let pnts = pointsToChart($$props.points, names.y1, names.y2);
    console.log(pnts);
    return pnts;
  })();
</script>

<div class="root" style={$$props.style}>
  <Chart data={data[names.y1]} axis_x={axies[names.x]} axis_y={axies[names.y1]} stroke='blue' marker={markers[names.y1]}/>
  <Chart data={data[names.y2]} axis_x={axies[names.x]} axis_y={axies[names.y2]} stroke='green' marker={markers[names.y2]}/>
</div>

<style>
  .root {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>