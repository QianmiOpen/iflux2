//@flow
import * as React from 'react'
import { Relax } from 'iflux2'

type Handler = () => void

const noop = () => { }

@Relax
export default class Edit extends React.Component<any, any> {
  props: {
    title?: string;
    content?: string;
    submit?: Handler;
    changeTitle?: (text: string) => void;
    changeContent?: (text: string) => void;
  };

  static defaultProps = {
    title: '',
    content: '',
    submit: noop,
    changeTitle: noop,
    changeContent: noop
  };

  render() {
    const { title, content, submit } = this.props

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
          <br />
          content:
          <textarea
            value={content}
            onChange={this._handleContentChange}
          />
          <br />
          <input type="submit" value="post" />
        </fieldset>
      </form>
    )
  }

  _handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeTitle(e.target.value)
  };


  _handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.changeContent(e.target.value)
  };
}
