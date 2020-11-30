
import * as Config from './config';

describe('Config', () => {

  it('will add helpers', () => {
    expect(Config.helpers).toBeObject();
    expect(Config.helpers.eachColor).toBeDefined();
    
    const fn = jest.fn();
    Config.addHelper('test', fn);
    expect(Config.helpers.test).toBe(fn);
  });
  
  test('default helper', () => {
    expect(Config.helpers.default).toBeFunction();
    expect(Config.helpers.default('test')).toEqual('!!test!!');
  });
  
});
