
import * as Each from './each';
import * as Config from './config';

describe('each', () => {
  
  describe('eachChar', () => {

    let output: string;
    let eachFn: jest.Mock<any,any>;
    
    beforeEach( () => {
      output = '';
      eachFn = jest.fn().mockImplementation( (ch, fg) => {
        if (fg) { output += `#${fg}#`; }
        output += ch;
      });
    });
    
    test('Simple text', () => {
      const fn = jest.fn();
      
      Each.eachChar('test', fn);
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn).toHaveBeenCalledWith('t', null, null, 0, 0);
      expect(fn).toHaveBeenCalledWith('e', null, null, 1, 1);
      expect(fn).toHaveBeenCalledWith('s', null, null, 2, 2);
      expect(fn).toHaveBeenCalledWith('t', null, null, 3, 3);
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
      const eachColor = jest.fn().mockImplementation( (ctx) => { 
        ctx.fg = (ctx.fg ? 333 : 0); 
      });
      
      Config.addHelper('eachColor', eachColor);
      
      Each.eachChar('a ΩredΩtest∆ text', eachFn);
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual('a #333#t#333#e#333#s#333#t text');
    });
    
    test('placing color marker char', () => {
      Each.eachChar('a ΩΩ horseshoe ∆∆!', eachFn);
      expect(eachFn).toHaveBeenCalledTimes(16);
      expect(output).toEqual('a Ω horseshoe ∆!');
    });
    
  });
  
});