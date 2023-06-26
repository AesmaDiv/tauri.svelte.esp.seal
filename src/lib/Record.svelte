<script lang="ts">
  import { message } from "@tauri-apps/api/dialog";
  import SealInfo from "./Seal_Info.svelte";
  import SealType from "./Seal_Type.svelte";
  import Button from "./Components/Button.svelte";
  import { RECORD_COLUMNS } from "../database/db_tables";
  import { updateRecord, resetRecord } from "../stores/database";


  let form : HTMLFormElement;
  function onClick(command: string) {
    ({
      reset: () => resetRecord(),
      save:  () => submitForm(),
    })[command]();
  }
  function submitForm(){
    let formdata = Object.fromEntries(new FormData(form).entries());
    let record = [...RECORD_COLUMNS, { name: 'sealtype' }]
    .filter(item => item.name in formdata)
    .reduce((obj, val) => {
      obj[val.name] = formdata[val.name];
      if ('items' in val || ['id', 'sealtype'].includes(val.name)) { obj[val.name] = parseInt(obj[val.name]) }
      return obj;
    }, {});
    if (checkRequired(record)) updateRecord(record);
  }
  function checkRequired(record: {}) : boolean {
    if (!record) return false;
    let result = RECORD_COLUMNS.filter(item => item.required).every(item => !!record[item.name]);
    if (!result) message('Не все необходимые поля заполнены', 'Внимание');
    return result;
  }
</script>

<form class="record-form" bind:this={form} method="POST">
  <SealInfo />
  <SealType />
  <Button class="buttons" style="grid-column: 1;" onClick={() => onClick('reset')}>новый</Button>
  <Button class="buttons" style="grid-column: 4;" onClick={() => onClick('save')}>сохранить</Button>
</form>

<style>
  .record-form {
    /* width: 100%; */
    display: grid;
    height: fit-content;
    overflow: visible;
    padding-top: 10px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(11, 1fr);
    column-gap: 0.5em;
    row-gap: 0.5em;
  }
  .record-form :global(.buttons) {
    background-color: rgb(0, 200, 255);
    &:hover {
      outline: 1px solid white;
    }
  }


</style>