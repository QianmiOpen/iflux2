//@flow
import React, { Component } from 'react'
import { Relax} from 'iflux2'
const noop = () => {}

@Relax
export default class Edit extends Component {
  static defaultProps = {
    title: '',
    content: '',
    submit: noop,
    changeTitle: noop,
    changeContent: noop
  };

  render() {
    const {
      title,
      content,
      submit
     } = this.props

    return (
      <form onSubmit={submit}>
        <fieldset>
          <legend>new Blog:</legend>
          title:
          <input
            type="text"
            value={title}
            onChange={this._handleChangeTitle}
          />
          <br/>
          content:
          <textarea
            value={content}
            onChange={this._handleContentChange}
          />
          <br/>
          <input type="submit" value="post"/>
        </fieldset>
      </form>
    )
  }

  _handleChangeTitle = (e: SyntheticInputEvent) => {
    this.props.changeTitle(e.target.value)
  };


  _handleContentChange = (e: SyntheticInputEvent) => {
    this.props.changeContent(e.target.value)
  };
}
