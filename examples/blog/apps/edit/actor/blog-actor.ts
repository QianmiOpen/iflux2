import { Actor, Action, IMap } from 'iflux2'

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
  changeTitle(state: IMap, title: string) {
    return state.set('title', title)
  }

  @Action('changeContent')
  changeContent(state: IMap, content: string) {
    return state.set('content', content)
  }

  @Action('submit')
  submit(state: IMap) {
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
