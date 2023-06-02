<script lang="ts">
  import TextBox from "./Components/TextBox.svelte";
  import { ADAM_DATA, TEST_STATE, switchTest, resetTest, updatePoints, TestStates } from "../stores/equipment";

  export let state : TestStates;
  export let fields = [];
  const onClick = (event: Event) => {
    let sender = <HTMLDivElement>event.target;
    sender.classList.toggle("unpressed");
    event.type === "mousedown" && ({
      btn_start: () => switchTest(state),
      btn_reset: () => resetTest(state),
      btn_save:  () => updatePoints(state),
    })[sender.id]();
  }
</script>


<div class="root" style={$$props.style}>
  <div class="info">
    {#each fields as item}
      <TextBox name={item.name} title={item.label} value={$ADAM_DATA[item.name]?.toFixed(item.fixed || 0) || 0}/>
    {/each}
  </div>
  <div class="buttons">
    <div id="btn_start" class="button {!$TEST_STATE[state] ? 'unpressed' : ''}" on:mousedown={onClick}>
      {!$TEST_STATE[state] ? 'СТАРТ' : 'СТОП'}
    </div>
    <div id="btn_reset" class="button unpressed" on:mousedown={onClick} on:mouseup={onClick}>сброс</div>
    <div id="btn_save"  class="button unpressed" on:mousedown={onClick} on:mouseup={onClick}>сохранить</div>
  </div>
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info {
    display: flex;
    flex-direction: column;
  }
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: .4em;
  }
  .button {
    height: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    user-select: none;
    border-radius: 0.5em;
    box-shadow: 0px 1px 2px gray;
    background-color: rgb(0, 200, 255);
    color: white;
    padding-top: 2px;
  }
  .unpressed {
    box-shadow: 1px 3px 3px gray;
  }
  #btn_start {
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 4;

    background-color: red;
  }
  #btn_start.unpressed {
    background-color: green;
  }
  #btn_reset {
    grid-row: 2;
    grid-column-start: 1;
    grid-column-end: 1;
  }
  #btn_save {
    grid-row: 2;
    grid-column-start: 2;
    grid-column-end: 4;
  }
</style>