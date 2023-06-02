<script lang="ts">
  import { TESTLIST } from "../stores/database";

  let current = 0;
  const ROOT_STYLE = `${$$props.style} width: ${$$props.width}; height: ${$$props.height};`

  function onClick(event) {
    let row: HTMLTableRowElement = <HTMLTableRowElement>event.target.parentElement;
    if (current === (current = parseInt(row.id) || 0)) return;
    let obj: Object = [...row.children].reduce((accum, current) => {
      return {...accum, [current.id]: current.innerHTML}
    }, {});
    $$props.onSelect && $$props.onSelect(obj);
  }

  const hide = (key: string) => key === 'id' ? 'display: none' : '';
</script>

<div class="root" style="{ROOT_STYLE}">
  <div class="inner">
  <table class="table-list">
    <thead>
      {#if $$props.bindings }
        {#each Object.entries($$props.bindings) as [key, value]}
          <th style="{hide(key)}">{value}</th>
        {/each}
      {/if}
    </thead>
    <tbody>
      {#if $TESTLIST }
        {#each $TESTLIST as item, i}
        <tr id="{i + ''}" on:click={onClick} class="{i === current ? 'selected' : ''}">
          {#each Object.keys($$props.bindings) as key}
            <td id={key} style="{hide(key)}">{item[key]}</td>
          {/each}
        </tr>
        {/each}
      {/if}
    </tbody>
  </table>
  </div>
</div>

<style>
  .root {
    --color-main: rgb(255,255,255);
    --color-hover: rgb(200,200,200);
    --color-select: rgb(220,220,220);
    --color-border: rgb(220,220,220);
    overflow: hidden;
    border-radius: 0.5em;
  }
  .inner {
    overflow-x: hidden;
    overflow-y: scroll;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    margin: 3px 3px;
  }
  .inner::-webkit-scrollbar {
    width: 0.5em;
  }
  .inner::-webkit-scrollbar-track {
    background-color: var(--color-main);
  }
  .inner::-webkit-scrollbar-thumb {
    background-color: var(--color-hover);
    z-index: 3;
  }
  .table-list {
    width: 100%;
    border-collapse: collapse;
  }
  .table-list thead {
    background-color: var(--color-main);
    position: sticky;
    top: 0;
    text-align: left;
  }
  .table-list tr {
    background-color: var(--color-main);
    border-bottom: 1px solid var(--color-border);

    transition: background-color 250ms;
  }
  .table-list tr:hover {
    background-color: var(--color-hover);
  }
  .table-list tr.selected {
    background-color: var(--color-select);
  }
  .table-list th {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-left: 0.5em;
    outline: 1px solid var(--color-border);
  }
  .table-list td {
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    padding-left: 0.5em;
    transition: padding-top 300ms, padding-bottom 300ms;
    width: 1px;
    white-space: nowrap;
    cursor: default;
  }
  /* td:hover {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  } */
</style>