import { DoubleArray } from 'cheminfo-types';
import Matrix from 'ml-matrix';
import sequentialFill from 'ml-array-sequential-fill';

let matrix = [[0.1, 1.1, 2.1], [1.1, 0.1, 1.1], [2.1, 1.1, 0.1]]
    let assignment = assign2D(matrix, false);
    console.log(assignment)
export function assign2D(input: DoubleArray[], maximaze = true) {
  if (input[0].length > input.length) {
    throw new Error('the matrix should have at least less rows than columns');
  }

  let matrix = Matrix.checkMatrix(input);

  let didFlip = false;
  if (matrix.columns > matrix.rows) {
    didFlip = true;
    matrix = matrix.transpose();
  }

  let nbRows = matrix.rows;
  let nbColumns = matrix.columns;

  let matrixDelta = maximaze ? matrix.max() : matrix.min();
  matrix = matrix.subtract(matrixDelta);

  let col4row: DoubleArray = new Float64Array(nbRows);
  let row4col: DoubleArray = new Float64Array(nbColumns);
  let dualVariableForColumns: DoubleArray = new Float64Array(nbColumns);
  let dualVariableForRows: DoubleArray = new Float64Array(nbRows);

  for (let currUnAssCol = 0; currUnAssCol < nbColumns; currUnAssCol++) {
    let currentAugmenting = getShortestPath({
      matrix,
      currUnAssCol,
      dualVariableForColumns,
      dualVariableForRows,
      col4row,
      row4col,
    });

    let { sink, pred } = currentAugmenting;
    console.log('pred', pred)
    if (sink === -1) {
      return {
        col4row: [],
        row4col: [],
        gain: -1,
      }
    }

    dualVariableForColumns = currentAugmenting.dualVariableForColumns;
    dualVariableForRows = currentAugmenting.dualVariableForRows;

    console.log(dualVariableForColumns, dualVariableForRows)
    let j = sink;
    console.log(JSON.stringify(sink));
    console.log(`j ${j}, currUnAssCol ${currUnAssCol}`)
    for (let i = pred[j]; true; i = pred[j]) {
      col4row[j] = i;
      let h = row4col[i];
      row4col[i] = j;
      j = h;
      if (i === currUnAssCol) break;
    }
    console.log(JSON.stringify({j, sink}));
  }

  let gain = 0;
  for (let curCol = 0; curCol < nbColumns; curCol++) {
    gain += matrix.get(row4col[curCol], curCol);
  }

  gain = ((maximaze ? -1 : 1) * gain) + (matrixDelta * nbColumns);

  if (didFlip) {
    [row4col, col4row] = [col4row, row4col];
    [dualVariableForColumns, dualVariableForRows] = [dualVariableForRows, dualVariableForColumns];
  }

  return {
    col4row,
    row4col,
    gain,
    dualVariableForColumns,
    dualVariableForRows
  }
}

interface GetShortestPathOptions {
  currUnAssCol: number,
  dualVariableForColumns: DoubleArray,
  dualVariableForRows: DoubleArray,
  col4row: DoubleArray,
  row4col: DoubleArray,
  matrix: Matrix,
}

function getShortestPath(options: GetShortestPathOptions) {
  let {
    currUnAssCol,
    dualVariableForColumns,
    dualVariableForRows,
    col4row,
    row4col,
    matrix,
  } = options;

  let nbRows = matrix.rows
  let nbColumns = matrix.columns;

  let pred = new Float64Array(nbColumns);
  let scannedColumns = new Float64Array(nbColumns);
  let scannedRows = new Float64Array(nbRows);

  let rows2Scan = sequentialFill({from: 0, to: nbRows - 1, size: nbRows});
  let numRows2Scan = nbRows;

  let sink = -1;
  let delta = 0;
  let curColumn = currUnAssCol;
  let shortestPathCost = getArrayOfInfinity(nbRows);

  for (; sink === -1;) {
    scannedColumns[curColumn] = 1;
    let minVal = Number.POSITIVE_INFINITY;
    let closestRowScan = -1;
    for (let curRowScan = 0; curRowScan < numRows2Scan; curRowScan++) {
      let curRow = rows2Scan[curRowScan];
      // console.log(`curRow ${curRow}, ${curRowScan}`)
      let reducedCost = delta + matrix.get(curRow, curColumn) - dualVariableForColumns[curColumn] - dualVariableForRows[curRow];
      console.log('reduced cost', reducedCost, curColumn, shortestPathCost[curRow])
      if (reducedCost < shortestPathCost[curRow]) {
        pred[curRow] = curColumn;
        shortestPathCost[curRow] = reducedCost
      }

      if (shortestPathCost[curRow] < minVal) {
        minVal = shortestPathCost[curRow];
        closestRowScan = curRowScan;
      }
    }
    if (!Number.isFinite(minVal)) {
      return { dualVariableForColumns, dualVariableForRows, sink, pred };
    }
    let closestRow = rows2Scan[closestRowScan];
    scannedRows[closestRow] = 1;
    numRows2Scan -= 1;
    rows2Scan.splice(closestRowScan, 1);
    delta = shortestPathCost[closestRow];

    if (col4row[closestRow] === 0) {
      sink = closestRow;
    } else {
      curColumn = col4row[closestRow];
    }
    console.log(`sink ${sink}`);
  }
  console.log('sale loop sink')
  dualVariableForColumns[currUnAssCol] += delta;

  for (let sel = 0; sel < nbColumns; sel++) {
    if (scannedColumns[sel] === 0) continue;
    if (sel === currUnAssCol) continue;
    dualVariableForColumns[sel] += delta - shortestPathCost[row4col[sel]];
  }
  for (let sel = 0; sel < nbRows; sel++) {
    if (scannedRows[sel] === 0) continue;
    dualVariableForRows[sel] -= (delta - shortestPathCost[sel]);
  }
  console.log('return')
  return {
    sink, pred, dualVariableForColumns, dualVariableForRows
  }
}

function getArrayOfInfinity(nbElements = 1, value = Number.POSITIVE_INFINITY) {
  const array = new Array(nbElements);
  for (let i = 0; i < nbElements; i++) {
    array[i] = value;
  }
  return array;
}