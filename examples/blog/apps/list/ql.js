//@flow
import {QL} from 'iflux2'

//query lang
export const helloQL = QL('helloQL', [
  'msg',
  (msg) => `${msg} from ql`
])
