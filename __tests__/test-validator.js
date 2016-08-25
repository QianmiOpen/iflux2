jest.unmock('../src/Validator');
import Validator from '../src/Validator';


describe('validator rule', () => {
  it('it should be email', () => {
    expect(true).toEqual(Validator.email('loveruby1988@qq.com'));
    expect(false).toEqual(Validator.email('hello'));
  });


  it('it should be url', () => {
    expect(true).toEqual(Validator.url('http://www.qianmi.com'));
    expect(true).toEqual(Validator.url('https://www.qianmi.com'));
    expect(true).toEqual(Validator.url('ftp://www.qianmi.com'));
    expect(false).toEqual(Validator.url('ftp1://www.qianmi.com'));
  });

  it('it should be required', () => {
    expect(false).toEqual(Validator.required(''));
    expect(true).toEqual(Validator.required('a'));
    expect(true).toEqual(Validator.required('1_'));
  });


  it('it should be date', () => {
    expect(true).toEqual(Validator.date(1223));
    expect(false).toEqual(Validator.date('1223s'));
  });

  it('it shoudld be number', () => {
    expect(true).toEqual(Validator.number(11));
    expect(true).toEqual(Validator.number(11.01));
    expect(true).toEqual(Validator.number(+11.01));
    expect(false).toEqual(Validator.number('+11.01a'));
  });

  it('it should be digits', () => {
    expect(true).toEqual(Validator.digits(1223));
    expect(false).toEqual(Validator.digits(1223.01));
  });


  it('it should be validate', () => {
    // console.groupCollapsed = console.log;
    // console.groupEnd = console.log;

    expect({
      result: false,
      errors: {
        username: ['username is required'],
        password: ['password is required'],
        age: ['年龄必须小于18岁']
      }
    }).toEqual(
      Validator.validate({
        username: '',
        password: '',
        age: 20
      }, {
        username: {
          required: true,
          message: {
            required: 'username is required'
          }
        },
        password: {
          required: true,
          message: {
            required: 'password is required'
          }
        },
        age: {
          max: 18,
          message: {
            max: '年龄必须小于18岁'
          }
        }
      })
    )
  });


  it('it should be validate (enable oneError)', () => {
    expect({
      result: false,
      errors: {
        username: ['username is required']
      }
    }).toEqual(
      Validator.validate({
        username: '',
        password: ''
      }, {
        username: {
          required: true,
          message: {
            required: 'username is required'
          }
        },
        password: {
          required: true,
          message: {
            required: 'password is required'
          }
        }
      }, {oneError: true})
    )
  });


  it('custom validate filed', () => {
    expect({
      result: false,
      errors: {
        username: [
          'username is required.'
        ]
      }
    }).toEqual(
      Validator.validate({
        username: '',
        password: ''
      }, {
        username: {
          required: true,
          message: {
            required: 'username is required.'
          }
        },
        password: {
          required: true,
          message: {
            required: 'password is reqired.'
          }
        }
      }, {
        validateFields: ['username']
      })
    )
  });

});
