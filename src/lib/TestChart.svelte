<script lang="ts">
  import Chart from "./Chart/Chart.svelte";
  import { pointsToChart } from "../database/db_funcs";

  export let axies = {}
  export let names: {x: string, y1: string, y2: string} = { x:'', y1:'', y2:'' }
  export let markers = {}
  export let titles : string[] = [];

  $: data = pointsToChart($$props.points, names);
</script>

<div class="root" style={$$props.style}>
  <Chart data={data[names.y1]} axis_x={axies[names.x]} axis_y={axies[names.y1]} marker={markers[names.y1]} 
    title={titles.length && titles[0] || ""} limits={$$props.limits ? $$props.limits[0] : undefined} stroke='blue'/>
  <Chart data={data[names.y2]} axis_x={axies[names.x]} axis_y={axies[names.y2]} marker={markers[names.y2]} 
    title={titles.length && titles[1] || ""} limits={$$props.limits ? $$props.limits[1] : undefined} stroke='green'/>
</div>

<style>
  .root {
    width: 100%;
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    gap: 1em;
    /* border: 1px dashed grey; */
  }
</style>