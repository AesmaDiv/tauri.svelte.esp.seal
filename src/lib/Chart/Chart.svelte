<!-- // TODO: доработать компонент для динамического добавления точек, чтоб не пересчитывал координаты для каждой точки -->
<script lang="ts">
  import { type Point, svgPath, bezierCommand } from "./bezier";

  type AxisInfo = {
    minimum : number,
    maximum : number,
    ticks : number,
    fixed? : number,
  }

  export let axis_x : AxisInfo;
  export let axis_y : AxisInfo;
  export let marker : Point = undefined;
  export let data : Point[];

  let width : number;
  let height : number;
  let chart_style = `
    stroke=${$$props.stroke || 'black'}
    stroke-width=${$$props.stroke-width || '2'} 
    fill='none'
  `;

  $: [dx, dy, points] = (() => {
    dx = {
      val: (axis_x.maximum - axis_x.minimum) / axis_x.ticks,
      pix: width / axis_x.ticks,
      coef: width / (axis_x.maximum - axis_x.minimum)
    };
    dy = { 
      val: (axis_y.maximum - axis_y.minimum) / axis_y.ticks,
      pix: height / axis_y.ticks,
      coef: height / (axis_y.maximum - axis_y.minimum)
    };
    points = data.map(point => { return { x: point.x * dx.coef, y: height - point.y * dy.coef}});

    return [dx, dy, points];
  })();

</script>

<div class="root" bind:clientWidth={width} bind:clientHeight={height}>
  {#if width}
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
    <!-- x axis -->
    <g class="x" transform="translate(0,{height + 20})">
      {#each Array(axis_x.ticks + 1) as _, div}
        <line x1={div * dx.pix} x2={div * dx.pix} y1={-20} y2={-height - 20}></line>
        <text x={div * dx.pix}>
          {axis_x.fixed ? (div * dx.val).toFixed(axis_x.fixed) : (div * dx.val)}
        </text>
      {/each}
    </g>
    <!-- y axis -->
    <g class="y" transform="translate(-8, 0)">
      {#each Array(axis_y.ticks + 1) as _, div}
        <line x1={8} x2={width + 8} y1={height - div * dy.pix} y2={height - div * dy.pix}></line>
        <text y={height - div * dy.pix} dominant-baseline="middle">
          {axis_y.fixed ? (div * dy.val).toFixed(axis_y.fixed) : (div * dy.val)}
        </text>
      {/each}
    </g>
    <!-- limits -->
    {#if $$props.limits}
      <g class="limits" transform="translate(0, {height}) scale(1,-1)">
        <rect x={0} y={0} {width} height={$$props.limits[0] * dy.coef} fill='yellow' fill-opacity='25%'/>
        <rect x={0} y={$$props.limits[1] * dy.coef} {width} height={height - $$props.limits[1] * dy.coef} fill='yellow' fill-opacity='25%'/>
      </g>
    {/if}
    <!-- marker -->
    {#if marker}
    <path transform="translate(0,{height - marker.y * dy.coef})" d="M 0,0 l -5,5 v -10 z"/>
    <path transform="translate({marker.x * dx.coef},{height})" d="M 0,0 l 5,5 h -10 z"/>
    {/if}
    <svg style="overflow: hidden" {width} {height}>
      {#if marker}
      <path transform="translate({marker.x * dx.coef},{height - marker.y * dy.coef})"
      d="M -5,0 h 10 M 0,-5 v 10" stroke='red'
      />
      {/if}
      <!-- data -->
      {@html svgPath(points, bezierCommand, chart_style)}
    </svg>
  </svg>
  {/if}
</div>

<style>
  .root {
    width: calc(100% - 4em);
    height: 100%;
    margin: 1em 1em 1.5em 3em;
    outline: 1px solid black;
  }
  svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    /* overflow-y: hidden; */
  }
  .x text {
		text-anchor: middle;
	}
	.y text {
		text-anchor: end;
	}
  line {
		fill: none;
		stroke: black;
    stroke-width: 1px;
    stroke-dasharray: 2;
	}
</style>