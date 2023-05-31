<script lang="ts">
  import { onMount } from "svelte";
  import TableList from "./lib/TableList.svelte";
  import Slider from "./lib/Components/Slider.svelte";
  import RecordInfo from "./lib/RecordInfo.svelte";
  import { readTestList, readRecord, readSealtypes } from "./stores/database";
  import TestPress from "./lib/TestPress.svelte";
  import TestPower from "./lib/TestPower.svelte";

  onMount(async () => {
    await readTestList();
    await readSealtypes();
  });

  let bindings = {
    id: '№',
    datetest: 'Дата',
    ordernum: 'Наряд-заказ',
    serial: 'Зав.номер'
  }
  let slider_group = 'Данные об объекте испытания :';

  const onSelect = async (row: Object) => await readRecord(parseInt(row['id']) || 0);
  const style = "box-shadow: 2px 2px 15px gray;";
</script>

<main class="container">
  <div class="root">
    <TableList width='600px' height='98vh' style={style} {bindings} {onSelect}/>
    <div class="sliders">
      <Slider title="Данные об объекте испытания :" bind:group={slider_group} {style}>
        <div class="slider-content"><RecordInfo /></div>
      </Slider>
      <Slider title="Измерение давления диафрагм :" bind:group={slider_group} {style}>
        <div class="slider-content"><TestPress /></div>
      </Slider>
      <Slider title="Измерение потребляемой мощности :" bind:group={slider_group} {style}>
        <div class="slider-content"><TestPower /></div>
      </Slider>
    </div>
  </div>
</main>

<style>
  .root {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }
  .sliders {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  .slider-content {
    height: 560px;
    background-color: white;
  }
</style>