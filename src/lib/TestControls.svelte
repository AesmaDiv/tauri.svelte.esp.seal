<script lang="ts">
  import TextBox from "./Components/TextBox.svelte";
  import { ADAM_DATA, TEST_STATE, switchTest, resetTest, updatePoints, TestStates } from "../stores/equipment";
  import Button from "./Components/Button.svelte";

  export let state : TestStates;
  export let fields = [];

  const onClick = (command: string) => {
    ({
      start: () => switchButton(state),
      reset: () => resetTest(state),
      save:  () => updatePoints(state),
    })[command]();
  }

  let btn_start_class : string = "test";
  let btn_start_value : string = "СТАРТ";
  const switchButton = (state: TestStates) => {
    btn_start_class = $TEST_STATE[state] ? 'test' : 'test stop';
    btn_start_value = $TEST_STATE[state] ? 'СТАРТ' : 'СТОП';
    switchTest(state);
  }
  
</script>


<div class="root" style={$$props.style}>
  <div class="info">
    {#each fields as item}
      <TextBox name={item.name} title={item.label} value={$ADAM_DATA[item.name]?.toFixed(item.fixed || 0) || 0}/>
    {/each}
  </div>
  <div class="buttons">
    <Button bind:class={btn_start_class} onClick={() => onClick('start')}>{btn_start_value}</Button>
    <Button class="reset" onClick={() => onClick('reset')}>сброс</Button>
    <Button class="save" onClick={() => onClick('save')}>сохранить</Button>
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
  .buttons :global(.test) {
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 4;
    background-color: green;
  }
  .buttons :global(.stop) {
    background-color: red;
  }
  .buttons :global(.reset),
  .buttons :global(.save) {
    grid-row: 2;
    background-color: rgb(0,200,255);
    
  }
  .buttons :global(.reset) {
    grid-column-start: 1;
    grid-column-end: 1;
  }
  .buttons :global(.save) {
    grid-column-start: 2;
    grid-column-end: 4;
  }
</style>