
import { text as Text } from './index';

describe('GW.text', () => {

  test('configure', () => {
    expect(Text.configure).toBeDefined();
    expect(Text.compile).toBeDefined();
    expect(Text.eachChar).toBeDefined();
  });
});
