<script lang="ts">
    import Logo from "./Logo.svelte";
    import Modal from "./Components/Modal.svelte";
    import Settings from "./Settings.svelte";
    import { saveSettings } from "../stores/settings";

    let showModal = false;

    function onSubmit() {
      let form: HTMLFormElement = <HTMLFormElement>document.getElementById("settings-form");
      if (!form) {
        console.log("Cant find settings form");
      } else {
        saveSettings(new FormData(form), true);
      }
    }
    function onClick(event: MouseEvent) {
      let target : HTMLDivElement = <HTMLDivElement>event.target;
      target.classList.toggle("unpressed");
      target.classList.contains("menu") && (showModal = !showModal);
    }

</script>

<div class="root" style={$$props.style}>
  <Modal style={$$props.style} bind:showModal onClick={onSubmit}>
    <h4 style="padding: 0; margin: 0; cursor: default;" slot="header">Параметры</h4>
    <Settings/>
  </Modal>
  <div on:mousedown={onClick} on:mouseup={onClick} class="header button unpressed menu"></div>
  <div class="header title">ЭПУ Сервис: Испытание Гидрозащиты</div>
  <div on:mousedown={onClick} on:mouseup={onClick} class="header button unpressed adam"/>
</div>

<style>
  .root {
    width: 100%;
    height: 3em;
    border-radius: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .button {
    display: flex;
    justify-content: center;
    height: 80%;
    margin: 5px;
    aspect-ratio: 1;
    border-radius: 15%;
    box-shadow: 1px 2px 2px gray;
  }
  .button:hover {
    outline: 1px solid gray;
  }
  .unpressed {
    box-shadow: 1px 3px 5px gray;
  }
</style>