
import { text as Text } from './gw';

describe('GW.text', () => {

  test('configure', () => {
    expect(Text.configure).toBeDefined();
    expect(Text.compile).toBeDefined();
    expect(Text.eachChar).toBeDefined();
  });
});
