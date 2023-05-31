import { COMBOS } from "../configs/cfg_localization";


/** Поля поиска для фильтрации списка записей */
export const RECORD_SEARCH_COLUMNS = [
  { col: 1, row: 1, name: "datetest",                 label: "Дата испытания"},
  { col: 1, row: 3, name: "customer", required: true, label: "Заказчик"},
  { col: 1, row: 4, name: "ordernum", required: true, label: "Наряд-заказ" },
  { col: 1, row: 7, name: "serial",   required: true, label: "Заводской номер" },
]
/** Поля информации о типоразмере, для отображения в форме */
export const SEALTYPE_COLUMNS = [
  { col: 1, row: 6, name: "sealtype",  required: true, label: "Тип ГЗ"},
  { col: 1, row: 8, name: "producer",  readonly: true, label: "Производитель" },
  { col: 2, row: 6, name: "limit_pwr", readonly: true, label: "Предел мощности"},
  { col: 2, row: 7, name: "limit_tmp", readonly: true, label: "Предел температуры"},
  { col: 2, row: 8, name: "limit_thr", readonly: true, label: "Предел нагрузки"},
]
/** Дополнительные поля со списками, для отображения в форме */
export const RECORD_COMBO_COLUMNS = [
  { col: 1, row: 9, name: "shaft_connection", label: "Шлицевое соединение",  items: COMBOS[false].connection},
  { col: 2, row: 9, name: "shaft_rotation",   label: "Направление вращения", items: COMBOS[false].rotation},
  { col: 3, row: 1, name: "head",             label: "Состояние головки",    items: COMBOS[false].state},
  { col: 3, row: 2, name: "base",             label: "Состояние основания",  items: COMBOS[false].state},
  { col: 3, row: 3, name: "coupling",         label: "Наличие муфты",        items: COMBOS[false].presence},
  { col: 4, row: 2, name: "oil_water",        label: "Масло, вода",          items: COMBOS[false].presence},
  { col: 4, row: 3, name: "oil_shavs",        label: "Масло, стружка",       items: COMBOS[false].presence},
]
/** Поля полной информации о записи, для отображения в форме */
export const RECORD_COLUMNS = [
  ...RECORD_SEARCH_COLUMNS,
  ...RECORD_COMBO_COLUMNS,
  // Если col = 0 -> элемент будет присутствовать на форме, но не будет отображаться (display: none)
  // Ecли row = 0 -> элемент будет пропущен и не помещен на форму
  { col: 0, row: 1,  name: "id",          label: "Номер записи"},
  { col: 1, row: 2,  name: "daterecv",    label: "Дата поступления"},
  { col: 2, row: 1,  name: "field",       label: "Месторождение" },
  { col: 2, row: 2,  name: "lease",       label: "Куст"},
  { col: 2, row: 3,  name: "well",        label: "Скважина"},
  { col: 2, row: 4,  name: "daysrun",     label: "Суточный пробег"},
  { col: 3, row: 4,  name: "pressure",    label: "Давление опрессовки"},
  { col: 4, row: 1,  name: "oil_color",   label: "Масло, цвет" },
  { col: 4, row: 4,  name: "oil_kvolt",   label: "Масло, диэл.прочность" },

  { col: 3, row: 6,  name: "runout_rad",  label: "Радиальное биение" },
  { col: 3, row: 7,  name: "runout_end",  label: "Торцевое биение"},
  { col: 3, row: 8,  name: "axial_play",  label: "Осевой люфт"},
  { col: 3, row: 9,  name: "momentum",    label: "Момент проворота"},
  { col: 4, row: 6,  name: "exten_top",   label: "Вал, вылет верх"},
  { col: 4, row: 7,  name: "exten_btm",   label: "Вал, вылет низ"},
  { col: 4, row: 8,  name: "shaft_yield", label: "Вал, текучесть"},
  { col: 4, row: 9,  name: "shaft_diam",  label: "Вал, диаметр"},
  { col: 0, row: 0,  name: "test_press",  label: "Давление диафрагм"},
  { col: 0, row: 0,  name: "test_power",  label: "Потребляемая мощность"},
  { col: 0, row: 0,  name: "rawdata",     label: "Данные испытания"},
  { col: 1, row: 10, name: "comments",    label: "Примечания"},
];
/** Структура словаря для комбобоксов */
export const DICT_COLUMNS = {
  id: "Номер",
  name: "Имя",
};
