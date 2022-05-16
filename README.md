# linear sum assignment

<p align="center">
  Package to perform a linear sum assignment even if the cost matrix is rectangular.
</p>
<p align="center">
  <img alt="NMReDATA" src="images/linear_assignment.svg">
</p>


This package is the implementation of Jonker-Volgenant shortest
augmenting path algorithm based on the publication [On implementing 2D rectangular assignment algorithms](https://doi.org/10.1109/TAES.2016.140952)

If the number of rows is <= the number of columns, then every row is assigned to one column; otherwise every column is assigned to one row. The assignment minimizes the sum of the assigned elements.

## Usage

```js
import linearSumAssignment from 'linearSumAssignment';

/**
 * there is one more value in the experimental values, so one of
 * them will be not assigned.
 **/
const xValueExperimental = [1, 2, 3, 4, 5, 7];
const xValuePredicted = [3.1, 1.1, 1.9, 3.99, 5.2];

/**
 * We will compute a cost matrix where xValueExperimental are
 * rows and xValuePredicted in columns.
 * In this case we will look for the closest peak for each experimental peak value.
 **/
const diff = xValueExperimental.map((experimental) => {
  return xValuePredicted.map((predicted) => {
    return Math.abs(predicted - experimental);
  });
});

const result = linearSumAssignment(diff, { maximaze: false });
console.log(result);
/**
{
  rowAssignments: Float64Array(6) [ 1, 2, 0, 3, 4, -1 ],
  columnAssignments: Float64Array(5) [ 2, 0, 1, 3, 4 ],
  gain: 0.5100000000000002,
  dualVariableForColumns: Float64Array(5) [
    0.0900000000000003,
    0.0900000000000003,
    0.0900000000000003,
    0,
    0.1900000000000004
  ],
  dualVariableForRows: Float64Array(6) [ 0, 0, 0, 0, 0, 0 ]
}
*/ 
```

 `rowAssignments` contains the index of the column assigned to each element in the rows (xValueExperimental). So the first element in xValueExperimental array is assigned to the second element of xValuePredicted.
 `columnAssignments` contains the index of the row assigned to
 each element in the columns. So the first element in
 xValuePredicted is assigned to third element in
 xValueExperimental.
 `dualVariableForColumns` and `dualVariableForRows` are the Lagrange multipliers or dual variables.
 `gain` the sum of the elements in the cost matrix.
## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/linearSumAssignment.svg
[npm-url]: https://www.npmjs.com/package/linearSumAssignment
[ci-image]: https://github.com/jobo322/linearSumAssignment/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/jobo322/linearSumAssignment/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/jobo322/linearSumAssignment.svg
[codecov-url]: https://codecov.io/gh/jobo322/linearSumAssignment
[download-image]: https://img.shields.io/npm/dm/linearSumAssignment.svg
[download-url]: https://www.npmjs.com/package/linearSumAssignment