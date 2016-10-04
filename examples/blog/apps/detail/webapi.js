import { fromJS } from 'immutable'

export const fetchDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        fromJS(JSON.parse(localStorage.getItem(`blog@${id}`)))
      )
    }, 200)
  })
};
