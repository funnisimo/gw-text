
import * as Compile from './compile';
import * as Config from './config';


describe('compile', () => {

  test('no replacements', () => {
    const template = Compile.compile('test');
    expect(template({})).toEqual('test');
  });
  
  test('placing a marker', () => {
    const template = Compile.compile('test §§!');
    expect(template({})).toEqual('test §!');
  })

  test('simple replacement', () => {
    const template = Compile.compile('My name is §name§.');
    expect(template({name: 'Henry' })).toEqual('My name is Henry.');
  });
  
  test('simple object fields', () => {
    const template = Compile.compile('My name is §actor.name§.');
    expect(template({ actor: { name: 'Henry' }})).toEqual('My name is Henry.');
  });

  test('base value', () => {
    let base = Compile.baseValue('field');
    expect(base({})).toEqual('!!field!!');
    expect(base({ field: 'test' })).toEqual('test');
    expect(base({ field: 3 })).toEqual(3);
    expect(base({ field: { obj: true }})).toEqual({ obj: true });
  });

  describe('field Value', () => {
    test('field from object', () => {
      const base = jest.fn().mockImplementation((a) => a);
      let field = Compile.fieldValue('field', base);
      expect(field({})).toEqual('!![object Object].field!!');
      expect(field({ field: 'test' })).toEqual('test');
      expect(field({ field: 3 })).toEqual(3);
      expect(field({ field: { obj: true }})).toEqual({ obj: true });
    });

    test('field from types', () => {
      const base = jest.fn().mockImplementation((a) => a.test);
      let field = Compile.fieldValue('field', base);
      expect(field({ test: 4 })).toEqual('!!4.field!!');
      expect(field({ test: 'taco' })).toEqual('!!taco.field!!');
      expect(field({ test: null } )).toEqual('!!null.field!!');
      expect(field({ test: [1,2,3] })).toEqual('!!1,2,3.field!!');
    });
    
  });

  describe('helper value', () => {
    
    test('missing helper', () => {
      const base = jest.fn().mockReturnValue('value');
      const helper = Compile.helperValue('missing', base);
      expect(helper({})).toEqual('Missing Helper:missing');
    });

    test('helper', () => {
      const myHelper = jest.fn().mockReturnValue('test');
      Config.addHelper('myHelper', myHelper);
      const base = jest.fn().mockReturnValue('value');
      const helper = Compile.helperValue('myHelper', base);
      expect(helper({})).toEqual('test');
      expect(myHelper).toHaveBeenCalledWith('myHelper', {}, 'value');
    });

  });


  test('String Format', () => {
    const source = jest.fn().mockReturnValue('test');
    let format = Compile.stringFormat('%s', source);
    expect(format({})).toEqual('test');

    format = Compile.stringFormat('%10s', source);
    expect(format({})).toEqual('      test');

    format = Compile.stringFormat('%-10s', source);
    expect(format({})).toEqual('test      ');    
  });

  test('Int Format', () => {
    const source = jest.fn().mockReturnValue('42');
    let format = Compile.intFormat('%d', source);
    expect(format({})).toEqual('42');

    format = Compile.intFormat('%4d', source);
    expect(format({})).toEqual('  42');

    format = Compile.intFormat('%+4d', source);
    expect(format({})).toEqual(' +42');

    format = Compile.intFormat('%-4d', source);
    expect(format({})).toEqual('42  ');    

    format = Compile.intFormat('%-+4d', source);
    expect(format({})).toEqual('+42 ');    

  });
  
  test('Float Format', () => {
    const source = jest.fn().mockReturnValue('4.2');
    let format = Compile.floatFormat('%f', source);
    expect(format({})).toEqual('4.2');

    format = Compile.floatFormat('%5f', source);
    expect(format({})).toEqual('  4.2');

    format = Compile.floatFormat('%+5f', source);
    expect(format({})).toEqual(' +4.2');

    format = Compile.floatFormat('%-5f', source);
    expect(format({})).toEqual('4.2  ');    

    format = Compile.floatFormat('%-+5f', source);
    expect(format({})).toEqual('+4.2 ');    

    format = Compile.floatFormat('%5.2f', source);
    expect(format({})).toEqual(' 4.20');

  });  
  
  describe('variable Value', () => {
    
    test('base', () => {
      const fn = Compile.makeVariable('base');
      expect(fn({ base: 'item' })).toEqual('item');
    });
    
    test('base.field', () => {
      const fn = Compile.makeVariable('base.field');
      expect(fn({ base: { field: 'item' } })).toEqual('item');
    })
    
    test('helper base', () => {
      const myHelper = jest.fn().mockImplementation((_,__,v) => 'test:' + v );
      Config.addHelper('myHelper', myHelper);
      
      const fn = Compile.makeVariable('myHelper base');
      expect(fn({ base: 'item' })).toEqual('test:item');
    });
    
    test('helper base.field', () => {
      const myHelper = jest.fn().mockImplementation((_,__,v) => 'test:' + v );
      Config.addHelper('myHelper', myHelper);
      
      const fn = Compile.makeVariable('myHelper base.field');
      expect(fn({ base: { field: 'item' } })).toEqual('test:item');
    });
    
    test('base%format', () => {
      const fn = Compile.makeVariable('base%10s');
      expect(fn({ base: 'item' })).toEqual('      item');
    });
    
    test('base.field%format', () => {
      const fn = Compile.makeVariable('base.field%4d');
      expect(fn({ base: { field: 4 } })).toEqual('   4');
    });
    
    test('helper base%format', () => {
      const myHelper = jest.fn().mockImplementation((_,__,v) => v + 1.1 );
      Config.addHelper('myHelper', myHelper);
      
      const fn = Compile.makeVariable('myHelper base%5.2f');
      expect(fn({ base: 2.2 })).toEqual(' 3.30');
    });
    
    test('helper base.field%format', () => {
      const myHelper = jest.fn().mockImplementation((_,__,v) => 'test:' + v );
      Config.addHelper('myHelper', myHelper);
      
      const fn = Compile.makeVariable('myHelper base.field%-12s');
      expect(fn({ base: { field: 'item' } })).toEqual('test:item   ');
    });
    
  });
});
