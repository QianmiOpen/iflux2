//@flow
import { Actor, Action } from 'iflux2'
import type {Map} from 'immutable'

type State = Map<string, number|string>;

export default class BlogActor extends Actor {
  defaultState() {
    return {
      id: 0,
      title: '',
      content: '',
      createAt: ''
    }
  }

  @Action('changeTitle')
  changeTitle(state: State, title: string) {
    return state.set('title', title)
  }

  @Action('changeContent')
  changeContent(state: State, content: string) {
    return state.set('content', content)
  }

  @Action('submit')
  submit(state: State) {
    const id = Date.now()
    const blog = (
      state
        .set('id', id)
        .set('createAt', new Date())
    )

    const blogIds = JSON.parse(localStorage.getItem('blog@all') || '[]').concat([id])
    localStorage.setItem(`blog@all`, JSON.stringify(blogIds))
    localStorage.setItem(`blog@${id}`, JSON.stringify(blog))

    window.location.href = '/#'
  }
}
