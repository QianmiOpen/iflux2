import msg from '../src/msg';


describe('msg test suite', () => {
  it('msg echo', () => {
    msg.on('ping', (hello) => {
      expect('hello').toEqual(hello);
    });

    msg.emit('ping', 'hello');
  });
});