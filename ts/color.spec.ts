
import * as Color from './color';


describe('color', () => {

  describe('encodeColor', () => {
    
    test('encodes fore colors', () => {
      expect(Color.encodeColor('fd3')).toEqual(String.fromCharCode(15, 13, 3));
      expect(Color.encodeColor('ffdd33')).toEqual(String.fromCharCode(15, 13, 3));
    });

    test('color names are white', () => {
      expect(Color.encodeColor('black')).toEqual(String.fromCharCode(15, 15, 15));
    });
    
  });
  
  describe('decodeColor', () => {
    
    test('reads color', () => {
      let c = Color.encodeColor('fd3');
      expect(Color.decodeColor(c)).toEqual(0xFD3);
    });
    
  });  
});



