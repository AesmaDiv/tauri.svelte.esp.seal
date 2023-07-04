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
/** Структура данный с ADAM */
export interface IAdamData {
  digital: IDigital,
  analog: IAnalog,
}
/** Структура дискретных канало ADAM */
export interface IDigital {
  slot: Array<number>
}
/** Структура аналоговых каналов ADAM */
export interface IAnalog {
  slot: Array<[number, number, number, number, number, number, number, number]>,
}
/** Класс дискретных состояний */
export class DigitalStates {
  lamp     : boolean;
  engine_r : boolean;
  engine_l : boolean;
  thrust   : boolean;
  valve    : boolean;
  alarm    : boolean;
}
/** Класс данных с датчиков */
export class Sensors {
  time      : number = 0;
  press_sys : number = 0;
  press_top : number = 0;
  press_btm : number = 0;
  speed     : number = 0;
  torque    : number = 0;
  temper    : number = 0;
  power     : number = 0;
};
/** Класс буферов данных с датчиков */
export class SensorsBuffers {
  press_sys : VBuffer;
  press_top : VBuffer;
  press_btm : VBuffer;
  speed     : VBuffer;
  torque    : VBuffer;
  temper    : VBuffer;

  constructor(size: number) {
    this.press_sys = new VBuffer(size);
    this.press_top = new VBuffer(size);
    this.press_btm = new VBuffer(size);
    this.speed     = new VBuffer(size);
    this.torque    = new VBuffer(size);
    this.temper    = new VBuffer(size);
  }
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
    pulling_rate: number,
    digital: {
      lamp:   IAdamSource,
      engine_r: IAdamSource,
      engine_l: IAdamSource,
      thrust: IAdamSource,
      valve:  IAdamSource,
      alarm:  IAdamSource,
    },
    analog: {
      press_sys: IAdamSourceParams,
      press_top: IAdamSourceParams,
      press_btm: IAdamSourceParams,
      torque: IAdamSourceParams,
      temper: IAdamSourceParams,
      speed: IAdamSourceParams,
    }
  },
}

export class VBuffer {
  values : Array<number>;
  size   : number;
  index  : number;

  constructor(size: number) {
    this.values = Array<number>(size);
    this.size = size;
    this.index = 0;
  }

  add(value: number) {
    this.values[this.index] = value;
    this.index += 1;
    if (this.index === this.size) this.index = 0;
  }

  getAverage() : number{
    let sum = this.values.reduce((a: number, v: number) => a + v, 0);
    let avr = sum / this.size;
    return avr;
  }
};
