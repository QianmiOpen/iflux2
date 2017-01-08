//@flow
import { Actor, Action } from 'iflux2'

import type {ActorState} from 'iflux2'

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
  changeTitle(state: ActorState, title: string) {
    return state.set('title', title)
  }

  @Action('changeContent')
  changeContent(state: ActorState, content: string) {
    return state.set('content', content)
  }

  @Action('submit')
  submit(state: ActorState) {
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
