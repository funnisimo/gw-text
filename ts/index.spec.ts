
import * as GWText from './index';

describe('GWText', () => {

  test('configure', () => {
    expect(GWText.options).toBeDefined();
    expect(GWText.configure).toBeDefined();
    expect(GWText.compile).toBeDefined();
    expect(GWText.eachChar).toBeDefined();
  });
});
