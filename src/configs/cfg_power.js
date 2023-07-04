/** Максимальнойе количество точек измерения потребляемой мощности */
export const POINTS_MAX = 6;
/** Свойства для закладки испытания потребляемой мощности*/
export const PowerProps = {
  NAME: "Power Consumption",
  TRACKED_STATE: 'test_power',
}
/** Свойства полей формы измерения потребляемой мощности */
export const DATANAMES = [
  {name: 'time',   fixed: 0, label: 'Время испытания'},
  {name: 'speed',  fixed: 0, label: 'Скорость, мин−1'},
  {name: 'torque', fixed: 4, label: 'Момент, Н*м'},
  {name: 'power',  fixed: 4, label: 'Мощность, кВт'},
  {name: 'temper', fixed: 2, label: 'Температура, °C'},
]
/** Параметры осей графика потребляемой мощности по умолчанию */
export const AXIES = {
  time   : { minimum: 0, maximum: 1500,  ticks: 5, },
  power  : { minimum: 0, maximum: 0.6, ticks: 6, round: 1 },
  temper : { minimum: 0, maximum: 150, ticks: 5, },
}