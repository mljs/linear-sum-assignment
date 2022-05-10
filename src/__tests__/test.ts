import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { assign2D } from '..';

expect.extend({ toMatchCloseTo });

describe('linear sum problem', () => {
  it('same number of rows and columns', () => {
    const a = [1, 2, 3, 4, 5];
    const b = [3.1, 1.1, 1.9, 3.99, 5.2];
    const diff = a.map((aElement) => {
      return b.map((bElement) => Math.abs(bElement - aElement));
    });
    const { columnAssignments, rowAssignments } = assign2D(diff, false);
    expect(columnAssignments).toMatchCloseTo([2, 0, 1, 3, 4]);
    expect(rowAssignments).toMatchCloseTo([1, 2, 0, 3, 4]);
  });

  it('differents number of rows and columns', () => {
    const a = [1, 2, 3, 4, 5, 7];
    const b = [3.1, 1.1, 1.9, 3.99, 5.2];
    const diff = a.map((aElement) => {
      return b.map((bElement) => Math.abs(bElement - aElement));
    });
    const { columnAssignments, rowAssignments } = assign2D(diff, false);
    expect(columnAssignments).toMatchCloseTo([2, 0, 1, 3, 4]);
    expect(rowAssignments).toMatchCloseTo([1, 2, 0, 3, 4, -1]);
  })
});
