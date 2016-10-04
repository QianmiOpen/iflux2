import React, {Component} from 'react'
import { Relax } from 'iflux2'
import { fromJS } from 'immutable'
import { Link } from 'react-router'


@Relax
export default class BlogList extends Component {
  static defaultProps = {
    blogs: fromJS([])
  };

  render() {
    const { blogs } = this.props

    if (blogs.isEmpty()) {
      return (
        <div>
          还木有blog
          <Link to="/new">赶紧的....</Link>
        </div>
      )
    }

    return (
      <ul>
        {blogs.map((v, k) => (
          <li key={k}>
            <Link key={k} to={`/detail/${v.get('id')}`}>
              {v.get('title')} - {v.get('createAt')}
            </Link>
          </li>
        ))}
      </ul>
    )
  }
}
