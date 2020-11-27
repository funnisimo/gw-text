
import * as Lines from './lines';


describe('wordWrap', () => {

  test('nextBreak', () => {
    expect(Lines.nextBreak('test', 0)).toEqual([4, 4]);

    expect(Lines.nextBreak('test test', 0)).toEqual([5, 4]);
    expect(Lines.nextBreak('test test', 5)).toEqual([9, 4]);

    expect(Lines.nextBreak('test test test', 5)).toEqual([10, 4]);
    expect(Lines.nextBreak('test test test', 10)).toEqual([14, 4]);

    expect(Lines.nextBreak('test tests test', 0)).toEqual([5,4]);
    expect(Lines.nextBreak('test tests test', 5)).toEqual([11,5]);
    expect(Lines.nextBreak('test tests test', 11)).toEqual([15,4]);

    expect(Lines.nextBreak('ΩorangeΩtest∆', 0)).toEqual([13,4]);

    expect(Lines.nextBreak('ΩorangeΩtest test test∆', 0)).toEqual([13,4]);
    expect(Lines.nextBreak('ΩorangeΩtest test test∆', 13)).toEqual([18,4]);
    expect(Lines.nextBreak('ΩorangeΩtest test test∆', 18)).toEqual([23,4]);

    expect(Lines.nextBreak('test ΩorangeΩtest test∆', 0)).toEqual([5,4]);
    expect(Lines.nextBreak('test ΩorangeΩtest test∆', 5)).toEqual([18,4]);
    expect(Lines.nextBreak('test ΩorangeΩtest test∆', 18)).toEqual([23,4]);

    expect(Lines.nextBreak('test ΩorangeΩtests∆ test', 0)).toEqual([5,4]);
    expect(Lines.nextBreak('test ΩorangeΩtests∆ test', 5)).toEqual([20,5]);
    expect(Lines.nextBreak('test ΩorangeΩtests∆ test', 20)).toEqual([24,4]);

    expect(Lines.nextBreak('tests tests tests', 0)).toEqual([6,5]);
    expect(Lines.nextBreak('tests tests tests', 6)).toEqual([12,5]);
    expect(Lines.nextBreak('tests tests tests', 12)).toEqual([17,5]);

    expect(Lines.nextBreak('tests ΩorangeΩtests∆ tests', 0)).toEqual([6,5]);
    expect(Lines.nextBreak('tests ΩorangeΩtests∆ tests', 6)).toEqual([21,5]);
    expect(Lines.nextBreak('tests ΩorangeΩtests∆ tests', 21)).toEqual([26,5]);
    
  });

  test('basic', () => {
    expect(Lines.wordWrap('test', 10)).toEqual('test');
    expect(Lines.wordWrap('test test test', 10)).toEqual('test test\ntest');
    expect(Lines.wordWrap('test tests test', 10)).toEqual('test tests\ntest');
    expect(Lines.wordWrap('tests tests tests', 10)).toEqual('tests\ntests\ntests');
  });

  test('colors', () => {
    expect(Lines.wordWrap('ΩorangeΩtest∆', 10)).toEqual('ΩorangeΩtest∆');

    expect(Lines.wordWrap('ΩorangeΩtest test test∆', 10)).toEqual('ΩorangeΩtest test\ntest∆');
    expect(Lines.wordWrap('test ΩorangeΩtest test∆', 10)).toEqual('test ΩorangeΩtest\ntest∆');
    expect(Lines.wordWrap('test ΩorangeΩtest∆ test', 10)).toEqual('test ΩorangeΩtest∆\ntest');

    expect(Lines.wordWrap('test tests test', 10)).toEqual('test tests\ntest');
    expect(Lines.wordWrap('ΩorangeΩtest tests test∆', 10)).toEqual('ΩorangeΩtest tests\ntest∆');
    expect(Lines.wordWrap('test ΩorangeΩtests∆ test', 10)).toEqual('test ΩorangeΩtests∆\ntest');

    expect(Lines.wordWrap('tests tests tests', 10)).toEqual('tests\ntests\ntests');
    expect(Lines.wordWrap('tests ΩorangeΩtests∆ tests', 10)).toEqual('tests\nΩorangeΩtests∆\ntests');
  });
  
});

