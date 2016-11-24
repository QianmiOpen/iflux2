import Store from '../src/store'

describe('store', () => {
  it('store init state', () => {
    const store = new Store()
    const state = store.state()
    expect(state).toMatchSnapshot()
  })

  it('store increment', () => {
    const store = new Store()
    store.dispatch('start')
    expect(store.state()).toMatchSnapshot()
  })

  it('store decrement', () => {
    const store = new Store()
    store.reset()
    expect(store.state()).toMatchSnapshot()
  })
})