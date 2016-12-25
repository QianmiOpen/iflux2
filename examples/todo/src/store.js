//@flow
import {Store} from 'iflux2'
import TextActor from './actor/text-actor'
import TodoActor from './actor/todo-actor'
import FilterActor from './actor/filter-actor'

type Options = {
  debug: boolean;
}

export default class AppStore extends Store {
  bindActor() {
    return [
      new TextActor,
      new TodoActor,
      new FilterActor
    ];
  }


  constructor(props: Options = {debug: false}) {
    super(props)
    if (__DEV__) {
      window._store = this;
    }
  }


//;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
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


  clearCompleted = async () => {
    this.dispatch('clearCompleted')
  }
}
