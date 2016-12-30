//@flow

'use strict;'

import { QL } from 'iflux2'

export const countQL = QL('countQL', [
  'count',
  (count) => `QL:${count}`
]);
