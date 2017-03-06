import { QL } from 'iflux2'

export const helloQL = QL('helloQL', [
  'msg',
  (msg) => `${msg} from ql`
])
