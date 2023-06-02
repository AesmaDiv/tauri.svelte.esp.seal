<script lang="ts">
  import { RECORD, CURRENT_SEALTYPE, POINTS_POWER, POINTS_PRESS, type PowerPoint } from "../stores/database";
  import { AXIES as press_axies } from "../configs/cfg_press";
  import { AXIES as power_axies, POINTS_MAX } from "../configs/cfg_power";

  import { HEADERS_PROTOCOL, COMBOS, transliterate } from "../configs/cfg_localization";
  import { roundValue, decimal2time } from "../funcs/shared";
  import Logo from "./Logo.svelte";
  import TestChart from "./TestChart.svelte";


  let eng = false
  /** значения комбобоксов */
  let head        = ""
  let base        = ""
  let coupling    = ""
  let rotation    = ""
  let connection  = ""
  let oil_water   = ""
  let oil_shavs   = ""
  let oil_color   = "";

  let [record, sealtype, points] = [{}, {}, []]

  const headers = HEADERS_PROTOCOL[eng]
  const press_names = {x: 'time', y1: 'press_top', y2: 'press_btm'};
  const power_names = {x: 'time', y1: 'power', y2: 'temper'};


  const cmbVal = (name: string, index: number) => {
    return typeof index === 'number' && COMBOS[eng][name][index - 1].name;
  }
  const trans = (text: string) => (eng ? transliterate(text) : text) || "";

  POINTS_POWER.subscribe(pnts => points = pnts);
  CURRENT_SEALTYPE.subscribe(seal => sealtype = seal);
  RECORD.subscribe(rec => {
    record = rec;
    head        = cmbVal('state',       record['head']);
    base        = cmbVal('state',       record['base']);
    coupling    = cmbVal('presence',    record['coupling']);
    rotation    = cmbVal('rotation',    record['shaft_rotation']);
    connection  = cmbVal('connection',  record['shaft_connection']);
    oil_water   = cmbVal('presence',    record['oil_water']);
    oil_shavs   = cmbVal('presence',    record['oil_shavs']);
    oil_color   = eng  ?  'Amber'   :   record['oil_color'];
  });


  const buildPointsTable = (points_power: PowerPoint[], headers) => {
    let rows = "";
    const points_count = Math.min(points_power.length, POINTS_MAX)
    for (let i = 0; i < points_count; i++) {
      rows+=`<tr key='test_table_row_${i}}'>
        <th scope="row">${i + 1}</th>
        <td>${roundValue(points_power[i].thrust, 3) || "-.-"}</td>
        <td>${roundValue(points_power[i].power, 3)}</td>
        <td>${roundValue(points_power[i].temper, 1)}</td>
        <td>${decimal2time(points_power[i].time)}</td>
      </tr>`;
    }
    let result = `<table>
      <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">${headers.table_axial}</th>
          <th scope="col">${headers.table_power}</th>
          <th scope="col">${headers.table_temp}</th>
          <th scope="col">${headers.table_time}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
    return result;
  }
</script>

<div id="Protocol" class="protocol">
  <div class="body">
    <header>
      <div class="header_pump_type">№ { record['id'] }</div>
      <div class="header_title">
        <div class="header_logo"><Logo size={40}/></div>
        <p class="header_name">{headers.title}</p>
        <p class="header_town">{headers.town}</p>
      </div>
      <div class="header_test_time">{ record['datetest'] }</div>
    </header>
    <main>
      <p style="margin-top: 40;">{headers.title_info}</p>
      <hr/>
      <div class="info_block">
        <span>{headers.producer}</span>
        <span>{headers.sealtype}</span>
        <span>{headers.serial}</span>
        <br/>
        <span>{headers.lmt_pwr}</span>
        <span>{headers.lmt_tmp}</span>
        <span>{headers.lmt_thr}</span>
        <span>{headers.connect}</span>
        <span>{headers.rotation}</span>

        <span>{trans(sealtype['producer'])}</span>
        <span>{trans(sealtype['name'])}</span>
        <span>{record['serial'] || ""}</span>
        <br/>
        <span>{sealtype['limit_pwr']}</span>
        <span>{sealtype['limit_tmp']}</span>
        <span>{record['limit_thr'] || ""}</span>
        <span>{connection}</span>
        <span>{rotation}</span>
        
        <span>{headers.exten_top}</span>
        <span>{headers.exten_btm}</span>
        <span>{headers.shaft_yeild}</span>
        <span>{headers.shaft_diam}</span>
        <br/>
        <span>{headers.runout_rad}</span>
        <span>{headers.runout_end}</span>
        <span>{headers.axial_play}</span>
        <span>{headers.momentum}</span>

      
        <span>{record['exten_top'] || ""}</span>
        <span>{record['exten_btm'] || ""}</span>
        <span>{record['shaft_yield'] || ""}</span>
        <span>{record['shaft_diam'] || ""}</span>
        <br/>
        <span>{record['runout_rad'] || ""}</span>
        <span>{record['runout_end'] || ""}</span>
        <span>{record['axial_play'] || ""}</span>
        <span>{record['momentum'] || ""}</span>

        <span/>
        <span/>
        <span/>
        <span/>
        <span/>
        <span>&#8804; 0.16 {headers.mms}</span>
        <span>&#8804; 0.10 {headers.mms}</span>
        <span>0.25 .. 1.2 {headers.mms}</span>
        <span>&#8804; 0.40 {headers.kgf}</span>
      </div>
      <br/>
      <p>{headers.title_test}</p>
      <hr/>
      <div class="info_block">
        <span>{headers.datetest}</span>
        <span>{headers.daterecv}</span>
        <span>{headers.customer}</span>
        <span>{headers.ordernum}</span>
        <br/>
        <span>{headers.field}</span>
        <span>{headers.lease}</span>
        <span>{headers.well}</span>
        <span>{headers.daysrun}</span>

        <span>{record['datetest'] || ""}</span>
        <span>{record['daterecv'] || ""}</span>
        <span>{record['customer'] || ""}</span>
        <span>{record['ordernum'] || ""}</span>
        <br/>
        <span>{trans(record['field'])}</span>
        <span>{trans(record['lease'])}</span>
        <span>{trans(record['well'])}</span>
        <span>{record['daysrun'] || ""}</span>

        <span>{headers.head}</span>
        <span>{headers.base}</span>
        <span>{headers.coupling}</span>
        <span>{headers.pressure}</span>
        <br/>
        <span>{headers.oil_color}</span>
        <span>{headers.oil_water}</span>
        <span>{headers.oil_shavs}</span>
        <span>{headers.oil_kvolt}</span>

        <span>{head}</span>
        <span>{base}</span>
        <span>{coupling}</span>
        <span>{record['pressure'] || ""}</span>
        <br/>
        <span>{oil_color}</span>
        <span>{oil_water}</span>
        <span>{oil_shavs}</span>
        <span>{record['oil_kvolt'] || ""}</span>
      </div>
      <br/>
      <p>{headers.title_result}</p>
      <hr/>
      <div class="test_charts">
        <TestChart style="height: 120px;" axies={power_axies} points={$POINTS_POWER} names={power_names}/>
        <TestChart style="height: 120px;" axies={press_axies} points={$POINTS_PRESS} names={press_names}/>
      </div>
      <div class="test_table">
        {@html buildPointsTable(points, headers)}
      </div>
      <p style="align-self: left;">{headers.note}</p>
    </main>
    <footer>
      <div class="comments">
        <p>{headers.comments}</p>
        <div>
          Должен заметить, что мы продолжаем мониторинг, и должен также заметить,
          что это не первый случай, когда после предостережений, высказанных в том
          числе и членами нашей комиссии, такие компании, как Google, удаляют
          вредоносный контент, который, по сути, является противоправным.
        </div>
      </div>
      <div class="signatures">
        <p>{headers.operator}</p>
        <p>{headers.foreman}</p>
        <p>_________________________</p>
        <p>_________________________</p>
      </div>
    </footer>
  </div>
</div>

<style>
.protocol {
  width: 210mm;
  height: 290mm;
  display: inline-flex;
  height: 100%;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  overflow: scroll;
}
.body {
  width: 210mm;
  height: 285mm;
  color: black;
  background-color: rgb(255,255,255);
  --border-style: 1px solid black;
  font-size: small;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
p {
  margin: 2px;
  font-weight: 600;
}
/* ЗАГОЛОВОК */
header {
  width: 100%;
  height: 2em;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  grid-template-rows: 100%;
  align-items: flex-start;
}
.header_pump_type {
  justify-self: stretch;
  text-align: start;
}
.header_title {
  width: 100%;
  display: grid;
  grid-template-columns: 0px 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 0px;
  row-gap: 0px;
}
.header_logo {
  grid-row-start: 1;
  grid-row-end: 3;
}
.header_name, .header_town {
  grid-column-start: 2;
  grid-column-end: 4;
  
}
.header_name {
  grid-row: 1;
}
.header_town {
  grid-row: 2;
}
.header_title p {
  display: inline;
  font-weight: 800;
  font-size: 16px;
  text-align: center;
  margin: 0;
}
.header_test_time {
  justify-self: stretch;
  text-align: end;
}
/* СОДЕРЖАНИЕ */
main {
  width: 100%;
  flex-grow: 2;
  font-size: smaller;
  text-align: left;
}
main p {
  margin-left: 1em;
}
.info_block {
  display: grid;
  grid-auto-flow: column;
  text-align: left;
  margin: 0em 1em;
  grid-template-columns: 30% 20% 30% 10% 10%;
  grid-template-rows: repeat(9, auto);
}
.test_results {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: row;
}
.test_charts {
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  height: 300px;
}
.test_table {
  padding: 1em;
  width: 50%;
}
.test_table table {
  width: 100%;
  height: auto;
  border: 2px solid black;
  border-collapse: collapse;
  text-align: center;
}
.test_table th,
.test_table tr, 
.test_table td {
  border: 1px solid grey;
}
.graph_container {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  background-color: bisque;
  border: 1px solid black;
}
.result_tables_container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}
.result_table {
  display: grid;
  justify-items: stretch;
  width: 49%;
  grid-template-rows: repeat(5, auto);
  grid-template-columns: 200px repeat(2, calc((100% - 200px) / 2));
  grid-auto-flow: column;
  border-bottom: var(--border-style);
  border-right: var(--border-style);
}
.result_bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
/* ОСНОВАНИЕ */
footer {
  width: 100%;
  height: 7em;
  display: flex;
  flex-direction: row;
  font-size: smaller;
}
.comments {
  width: 60%;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1em;
  margin-left: 1em;
}
.signatures {
  width: 40%;
  display: grid;
  grid-template-rows: repeat(2, 50%);
  grid-template-columns: 50% 50%;
  grid-auto-flow: column;
  row-gap: 2em;
  margin-right: 1em;
}
</style>