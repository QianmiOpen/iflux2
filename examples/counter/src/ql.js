//@flow
import { QL } from 'iflux2'

//dev
//in order to quick test ql in chrome
if (__DEV__) {
  window.QL = QL
}

export const countQL = QL('countQL', [
  'count',
  (count) => `QL:${count}`
]);
