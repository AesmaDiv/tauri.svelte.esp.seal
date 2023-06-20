/** Состояния испытаний */
export enum TestStates {
  IDLE  = '',
  PRESS = 'test_press',
  POWER = 'test_power',
}
/** Тип точки графика */
export class Point {
  x : number = 0;
  y : number = 0;
};
export interface IMarkerPress {
  press_top : Point,
  press_btm : Point
};
export interface IMarkerPower {
  power : Point,
  temper: Point
};
/** Класс блока данных с ADAM */
export class AdamData {
  time      : number = 0;
  press_sys : number = 0;
  press_top : number = 0;
  press_btm : number = 0;
  speed     : number = 0;
  torque    : number = 0;
  temper    : number = 0;
  power     : number = 0;
};
/** Тип точки для испытания давления диафрагм */
export type PressPoint = {
  /** время */
  time : number,
  /** давление верхний диафрагмы */
  press_top  : number,
  /** давление нижней диафрагмы */
  press_btm  : number,
}
/** Тип точки для измерения потребляемой мощности */
export type PowerPoint = {
  /** время */
  time : number,
  /** потребляемая мощность */
  power      : number,
  /** температура */
  temper     : number,
  /** осевая нагрузка */
  thrust?    : number,
}
export interface ITiming {
  duration: number, pulling_rate: number, points_count: number
}
export interface IAdamSource {
  slot: number, channel: number
}
export interface IAdamSourceParams extends IAdamSource {
  d_range: number, offset: number, v_range: number, coeff: number
}
export interface ISettings {
  db: {
    path: string;
  },
  test: {
    test_press: ITiming,
    test_power: ITiming
  },
  adam: {
    ip: string,
    pulling_rate: number
    digital: {
      lamp:   IAdamSource,
      engine: IAdamSource,
      thrust: IAdamSource,
      valve:  IAdamSource,
      alarm:  IAdamSource,
    },
    analog: {
      sys: IAdamSourceParams,
      btm: IAdamSourceParams,
      top: IAdamSourceParams,
      rpm: IAdamSourceParams,
      trq: IAdamSourceParams,
      tmp: IAdamSourceParams,
    }
  },
}