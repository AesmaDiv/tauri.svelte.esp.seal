<script lang="ts">
  import { message } from "@tauri-apps/api/dialog";
  import SealInfo from "./Sealinfo.svelte";
  import SealType from "./Sealtype.svelte";
  import { RECORD_COLUMNS } from "../database/db_tables";
  import { updateRecord, resetRecord } from "../stores/database";

  let form : HTMLFormElement;

  function onClick(event: Event) {
    let sender = <HTMLDivElement>event.target;
    sender.classList.toggle("unpressed");
    event.type === "mousedown" && ({
      btn_reset: () => resetRecord(),
      btn_save:  () => submitForm(),
    })[sender.id]();
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
    checkRequired(record) && updateRecord(record);
  }
  function checkRequired(record: {}) : boolean {
    if (!record) return false;
    let result = RECORD_COLUMNS.filter(item => item.required).every(item => !!record[item.name]);
    !result && message('Не все необходимые поля заполнены', 'Внимание');
    return result;
  }
</script>

<form bind:this={form} method="POST">
  <SealInfo />
  <SealType />
  <div id="btn_reset" class="button unpressed" style="grid-column: 1" on:mouseup={onClick} on:mousedown={onClick}>сброс</div>
  <div id="btn_save" class="button unpressed" style="grid-column: 4" on:mouseup={onClick} on:mousedown={onClick}>сохранить</div>
</form>

<style>
  form {
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
  .button {
    all: unset;
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
    grid-row: 12;
  }
  .unpressed {
    box-shadow: 1px 3px 3px gray;
  }

</style>