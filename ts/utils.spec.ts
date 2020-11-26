
import * as Utils from './utils';


describe('length', () => {
  
  test('no colors', () => {
    expect(Utils.length('test')).toEqual(4);
  });
  
  test('colors', () => {
    expect(Utils.length('ΩredΩtest∆')).toEqual(4);
    expect(Utils.length('a ΩredΩmiddle∆ test')).toEqual(13);
  });
  
});


describe('padStart', () => {

  test('no colors', () => {
    expect(Utils.padStart('test', 10)).toEqual('      test');
  });
  
  test('colors', () => {
    expect(Utils.padStart('ΩredΩtest∆', 10)).toEqual('      ΩredΩtest∆');
  });
    
});

describe('padEnd', () => {

  test('no colors', () => {
    expect(Utils.padEnd('test', 10)).toEqual('test      ');
  });
  
  test('colors', () => {
    expect(Utils.padEnd('ΩredΩtest∆', 10)).toEqual('ΩredΩtest∆      ');
  });
  
});


describe('center', () => {
  test('no colors', () => {
    expect(Utils.center('test', 10)).toEqual('   test   ');
  });
  
  test('colors', () => {
    expect(Utils.center('ΩredΩtest∆', 10)).toEqual('   ΩredΩtest∆   ');
  });
  
});
