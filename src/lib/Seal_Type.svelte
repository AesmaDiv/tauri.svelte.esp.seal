<script lang="ts">
  import TextBox from "./Components/TextBox.svelte";
  import { CURRENT_SEALTYPE, SEALTYPES_LIST } from "../stores/database";
  import { SEALTYPE_COLUMNS } from "../database/db_tables";


  function onChangeSealtype(new_value: number) {
    const new_sealtype = $SEALTYPES_LIST.find(item => item.id === new_value) || {};
    CURRENT_SEALTYPE.set(new_sealtype);
  }
</script>

{#each SEALTYPE_COLUMNS as item}
  {#if item.name === 'sealtype'}
  <TextBox name={item.name} title="{item.label}" value={$CURRENT_SEALTYPE ? $CURRENT_SEALTYPE['id'] : null}
    select={!!$SEALTYPES_LIST} options={$SEALTYPES_LIST} optionKey="name" optionValue="id"
    required={item.required} onChange={onChangeSealtype}
    backgroundColor="white" style="width: 100%; grid-column: {item.col}; grid-row: {item.row};"
  />
  {:else}
  <TextBox name={item.name} title="{item.label}" value={$CURRENT_SEALTYPE ? $CURRENT_SEALTYPE[item.name] : null}
    select={!!item.items} options={item.items} optionKey="name" optionValue="id"
    required={item.required} readonly={item.readonly}
    backgroundColor="white" style="width: 100%; grid-column: {item.col}; grid-row: {item.row};"
  />
  {/if}
{/each}

<style>
</style>