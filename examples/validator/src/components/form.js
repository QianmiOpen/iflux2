//@flow
import React, { Component } from 'react'
import { Relax } from 'iflux2'
import FormField from './form-field'
import Button from './button-field'
import {validatorQL} from '../ql'
const noop = () => {}

@Relax
export default class Form extends Component {
  static defaultProps = {
    username: '',
    password: '',
    confirm: '',
    email: '',
    qq: '',
    validator: validatorQL,
    changeValue: noop,
    validateField: noop,
    reset: noop
  };

  render() {
    const {
      username,
      password,
      confirm,
      email,
      qq,
      changeValue,
      validateField,
      reset
    } = this.props;

    return (
      <fieldset>
        <legend>{'user profile'}</legend>
        <form
          onSubmit={e => {e.preventDefault(); validateField('all')}}
          onChange={e => changeValue(e.target.name, e.target.value)}
          onBlur={e => validateField(e.target.name)}
        >
          <table>
            <tbody>
            {/* username */}
            <FormField error={this._getErrorInfo('username')} label="username:" required={true}>
              <input
                type="text"
                name="username" value={username}
                />
            </FormField>

            {/* password */}
             <FormField error={this._getErrorInfo('password')} label={'password:'} required={true}>
              <input
                type="password"
                name="password"
                value={password}
              />
             </FormField>

             {/* confirm password*/}
             <FormField error={this._getErrorInfo('confirm')} label={' confirm password:'} required={true}>
              <input
                type="password"
                name="confirm"
                value={confirm}
              />
             </FormField>

             {/* email */}
             <FormField error={this._getErrorInfo('email')} label={'email:'} required={true}>
              <input
                type="email"
                name="email"
                />
             </FormField>

             {/* qq */}
             <FormField error={this._getErrorInfo('qq')} label={'qq:'} required={true}>
              <input
                type="text"
                name="qq"
                value={qq}
                />
             </FormField>

             <Button>
              <input type="submit" value="login"/>
              <input type="button" value="reset" onClick={(e) => reset()}/>
             </Button>
            </tbody>
          </table>
        </form>
      </fieldset>
    )
  }

  _getErrorInfo = (name: string) => {
    const errors = this.props.validator.errors
    return (errors[name] || [''])[0];
  };
}
