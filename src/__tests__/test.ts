import { assign2D } from '..';

describe('test myModule', () => {
  it('should return 42', () => {
    const a = [ 1 , 2 , 3, 4, 5 ];
    const b = [1.1, 1.9, 3.1, 3.99, 5.2];
    const diff = a.map((aElement) => {
      return b.map((bElement) => Math.abs(bElement - aElement));
    });
    console.log('diff', diff)
    const result = assign2D(diff, false);
    console.log(result)
    // expect(myModule()).toBe(42);
  });
});
