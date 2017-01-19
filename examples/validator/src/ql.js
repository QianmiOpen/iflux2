//@flow
import { QL } from 'iflux2'
import Validator from 'iflux2/contrib/validator'

export const validatorQL = QL('validatorQL', [
  'fields',
  'username',
  'password',
  'confirm',
  'email',
  'qq',
  (fields, username, password, confirm, email, qq) => {
    //初始状态不校验
    if (fields.isEmpty()) {
      return {errors: {}}
    }

    const form = {
      username,
      password,
      confirm,
      email,
      qq
    }

    //添加自定义规则
    Validator.addValidator('equal', (fieldName, value) => {
      return form[fieldName] === value;
    })

    const result = Validator.validate(form, {
      username: {
       required: true,
       maxLength: 10,
        message: {
          required: 'username is required',
          maxLength: 'username max length is 10'
        }
      },
      password: {
        required: true,
        message: {
          required: 'password is required'
        }
      },
      confirm: {
        required: true,
        equal: 'password',
        message: {
          required: 'confirm password is required.',
          equal: 'confirm password should be equal password'
        }
      },
      email: {
       required: true,
       email: true,
        message: {
          required: 'email is required.',
          email: 'email is invalid'
        }
      },
      qq: {
        required: true,
        qq: true,
        message: {
          required: 'qq is required.',
          qq: 'qq is invalid.'
        }
      }
    }, {debug: true, validateFields: fields.toArray()});

    return result;
  }
])
