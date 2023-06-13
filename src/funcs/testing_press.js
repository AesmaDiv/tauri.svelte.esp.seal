import { ACTIVE_TEST } from "../configs/cfg_hardware";
import { resetPoints, addPoint } from "../redux/recordReducer";
import { switchActiveTest } from "../redux/testingReducer";
import { setHardwareValues } from "../hardware/communication";
import { sleep } from "./shared";


const test = ACTIVE_TEST.test_press;

export function switchTestingPress(status, dispatch, init_values) {
  let state_str = status ? "Starting" : "Stopping";
  console.log(`${state_str} pressure test`);

  // переключение дискретных выходов
  setDigitals(status);
  // если происходит запуск испытания -> начинаем регистрацию данных
  if (status) {
    // очистка точек графика
    dispatch(resetPoints(test))
    // добавление первой точки
    dispatch(addPoint({ name: test, values: init_values }));
  }
  // переключение текущего испытания (вкл/выкл автодобавления точек)
  dispatch(switchActiveTest(status ? test : ACTIVE_TEST.none));
}

function switchTest() {
  // старт испытания
  let timeout = setTimeout(() => {
    // dispatch(switchActiveTest(active_test))
  }, 500)

  return (() => clearTimeout(timeout))
}

function setDigitals(state) {
  const val = state ? 0xff00 : 0x0000;
  (async() => {
    await setHardwareValues('digital', 7, 0, val, 50);
    await setHardwareValues('digital', 7, 1, val, 50);
    await setHardwareValues('digital', 7, 2, val, 50);
    await setHardwareValues('digital', 7, 3, val, 50);
    await setHardwareValues('digital', 7, 4, val, 50);
  })();
}
