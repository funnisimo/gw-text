
import * as Config from './config';

describe('Config', () => {

  it('will add helpers', () => {
    expect(Config.helpers).toBeDefined();
    expect(Config.helpers.eachColor).toBeDefined();
    
    const fn = jest.fn();
    Config.addHelper('test', fn);
    expect(Config.helpers.test).toBe(fn);
  });
  
});
