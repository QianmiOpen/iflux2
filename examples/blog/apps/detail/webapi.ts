import { fromJS } from 'immutable'

export const fetchDetail = (id: number): Promise<Object> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      //flow is so cool, it found a null exception.
      resolve(
        fromJS(JSON.parse(localStorage.getItem(`blog@${id}`) || ''))
      )
    }, 200)
  })
};
