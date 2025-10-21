import { describe, expect, it } from 'vitest';

import { linearSumAssignment } from '../index.ts';

describe('linear sum problem', () => {
  it('same number of rows and columns', () => {
    const a = [1, 2, 3, 4, 5];
    const b = [3.1, 1.1, 1.9, 3.99, 5.2];
    const diff = a.map((aElement) => {
      return b.map((bElement) => Math.abs(bElement - aElement));
    });
    const { columnAssignments, rowAssignments } = linearSumAssignment(diff, {
      maximaze: false,
    });
    expect(columnAssignments).toMatchCloseTo([2, 0, 1, 3, 4]);
    expect(rowAssignments).toMatchCloseTo([1, 2, 0, 3, 4]);
  });

  it('differents size: rows > columns', () => {
    const a = [1, 2, 3, 4, 5, 7];
    const b = [3.1, 1.1, 1.9, 3.99, 5.2];
    const diff = a.map((aElement) => {
      return b.map((bElement) => Math.abs(bElement - aElement));
    });
    const { columnAssignments, rowAssignments } = linearSumAssignment(diff, {
      maximaze: false,
    });
    expect(columnAssignments).toMatchCloseTo([2, 0, 1, 3, 4]);
    expect(rowAssignments).toMatchCloseTo([1, 2, 0, 3, 4, -1]);
  });
  it('differents size: rows < columns', () => {
    const a = [3.1, 1.1, 1.9, 3.99, 5.2];
    const b = [1, 2, 3, 4, 5, 7];
    const diff = a.map((aElement) => {
      return b.map((bElement) => Math.abs(bElement - aElement));
    });
    const { columnAssignments, rowAssignments } = linearSumAssignment(diff, {
      maximaze: false,
    });
    expect(columnAssignments).toMatchCloseTo([1, 2, 0, 3, 4, -1]);
    expect(rowAssignments).toMatchCloseTo([2, 0, 1, 3, 4]);
  });
  it('before failing case', () => {
    const diff = [
      [0.010000000000000009, 0.3999999999999999, 0.5, 1.0099999999999998],
      [0.49, 0.10000000000000009, 0, 0.5099999999999998],
      [0.99, 0.6000000000000001, 0.5, 0.009999999999999787],
    ];
    const { columnAssignments, rowAssignments } = linearSumAssignment(diff, {
      maximaze: false,
    });
    expect(columnAssignments).toMatchCloseTo([0, -1, 1, 2]);
    expect(rowAssignments).toMatchCloseTo([0, 2, 3]);
  });
});
