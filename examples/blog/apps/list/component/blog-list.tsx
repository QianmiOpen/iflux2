import * as React from 'react'
import { Relax, IMap } from 'iflux2'
import { fromJS, List } from 'immutable'
import { Link } from 'react-router'

@Relax
export default class BlogList extends React.Component<any, any> {
  props: {
    blogs?: List<IMap>
  }
  static defaultProps = {
    blogs: fromJS([])
  };

  render() {
    const { blogs } = this.props

    if (blogs.isEmpty()) {
      return (
        <div>
          还木有blog
        <Link to="/new" > 赶紧的....</Link>
        </div>
      )
    }

    return (
      <ul>
        {blogs.map((v, k) => (
          <li key={k} >
            <Link key={k} to={`/detail/${v.get('id')}`}>
              {v.get('title')} - {v.get('createAt')}
            </Link>
          </li>
        ))}
      </ul>
    )
  }
}
