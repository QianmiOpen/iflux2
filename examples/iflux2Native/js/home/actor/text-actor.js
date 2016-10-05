import { Action, Actor } from 'iflux2'

export default class TextActor extends Actor {
  defaultState() {
    return {
      text: 'Hello, ReactNative!!!'
    }
  }
}
