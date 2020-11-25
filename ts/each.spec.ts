
import * as Each from './each';
import * as Config from './config';

describe('each', () => {
  
  describe('eachChar', () => {

    let output: string;
    let eachFn: jest.Mock<any,any>;
    
    beforeEach( () => {
      output = '';
      eachFn = jest.fn().mockImplementation( (ch, _, fg) => {
        if (fg) { output += `#${fg}#`; }
        output += ch;
      });
    });
    
    test('Simple text', () => {
      const fn = jest.fn();
      
      Each.eachChar('test', fn);
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn).toHaveBeenCalledWith('t', 0, null, null);
      expect(fn).toHaveBeenCalledWith('e', 1, null, null);
      expect(fn).toHaveBeenCalledWith('s', 2, null, null);
      expect(fn).toHaveBeenCalledWith('t', 3, null, null);
    });

    test('color', () => {
      Each.eachChar('test', eachFn, 'red');
      expect(eachFn).toHaveBeenCalledTimes(4);
      expect(output).toEqual('#red#t#red#e#red#s#red#t');
    });

    test('starting color', () => {
      Each.eachChar('a ΩredΩtest∆ text', eachFn);
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual('a #red#t#red#e#red#s#red#t text');
    });
    
    test('transform color', () => {
      const colorStart = jest.fn().mockImplementation( (ctx) => { 
        ctx.fg = (ctx.fg ? 333 : 0); 
      });
      const colorEnd = jest.fn().mockImplementation( (ctx) => { ctx.fg = 0; } );
      
      Config.addHelper('colorStart', colorStart);
      Config.addHelper('colorEnd', colorEnd);
      
      Each.eachChar('a ΩredΩtest∆ text', eachFn);
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual('a #333#t#333#e#333#s#333#t text');
    });
    
  });
  
});