<script lang="ts">
  import TextBox from "./Components/TextBox.svelte";
  import { RECORD } from "../stores/database";
  import { RECORD_COLUMNS } from "../database/db_tables";

</script>

{#each RECORD_COLUMNS as item}
  {#if item.name === 'comments'}
    <TextBox name={item.name} title="{item.label}" lines={$RECORD[item.name]} value={$RECORD[item.name]}
      required={item.required} backgroundColor="white" 
      style="
        width: 100%;
        grid-column-start: {item.col};
        grid-row-start: {item.row};
        grid-column-end: 5;
        grid-row-end: 14;
      ";
    />
  {:else if item.row}
    <TextBox name={item.name} title="{item.label}" value={$RECORD[item.name]}
      select={!!item.items} options={item.items} optionKey="name" optionValue="id"
      required={item.required} backgroundColor="white" 
      style="
        display: {item.col === 0 ? 'none' : ''};
        width: 100%;
        grid-column: {item.col};
        grid-row: {item.row};
      ";
    />
  {/if}
{/each}

<style>
</style>