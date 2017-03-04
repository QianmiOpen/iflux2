import { Store, IOptions } from 'iflux2'
import TextActor from './actor/text-actor'
import TodoActor from './actor/todo-actor'
import FilterActor from './actor/filter-actor'

export default class AppStore extends Store {
  bindActor() {
    return [
      new TextActor,
      new TodoActor,
      new FilterActor
    ];
  }


  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      window['_store'] = this
    }
  }

  changeValue = (value: string) => {
    this.dispatch('changeValue', value);
  };

  submit = () => {
    const value = this.state().get('value');
    this.dispatch('submit', value);
  };

  changeFilter = (status: string) => {
    this.dispatch('filter', status)
  };

  toggle = (index: number) => {
    this.dispatch('toggle', index)
  }

  destroy = (index: number) => {
    this.dispatch('destroy', index)
  };

  toggleAll = (checked: number) => {
    this.dispatch('toggleAll', checked)
  };

  clearCompleted = () => {
    this.dispatch('clearCompleted')
  }
}
