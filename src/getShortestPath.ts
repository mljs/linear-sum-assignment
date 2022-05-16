import { DoubleArray } from 'cheminfo-types';
import sequentialFill from 'ml-array-sequential-fill';
import type { Matrix } from 'ml-matrix';

interface GetShortestPathOptions {
  currUnAssCol: number;
  dualVariableForColumns: DoubleArray;
  dualVariableForRows: DoubleArray;
  rowAssignments: DoubleArray;
  columnAssignments: DoubleArray;
  matrix: Matrix;
}

export function getShortestPath(options: GetShortestPathOptions) {
  let {
    currUnAssCol,
    dualVariableForColumns,
    dualVariableForRows,
    rowAssignments,
    columnAssignments,
    matrix,
  } = options;

  let nbRows = matrix.rows;
  let nbColumns = matrix.columns;

  let pred = new Float64Array(nbColumns);
  let scannedColumns = new Float64Array(nbColumns);
  let scannedRows = new Float64Array(nbRows);

  let rows2Scan = sequentialFill({ from: 0, to: nbRows - 1, size: nbRows });
  let numRows2Scan = nbRows;

  let sink = -1;
  let delta = 0;
  let curColumn = currUnAssCol;
  let shortestPathCost = getArrayOfInfinity(nbRows);

  while (sink === -1) {
    scannedColumns[curColumn] = 1;
    let minVal = Number.POSITIVE_INFINITY;
    let closestRowScan = -1;
    for (let curRowScan = 0; curRowScan < numRows2Scan; curRowScan++) {
      let curRow = rows2Scan[curRowScan];

      let reducedCost =
        delta +
        matrix.get(curRow, curColumn) -
        dualVariableForColumns[curColumn] -
        dualVariableForRows[curRow];
      if (reducedCost < shortestPathCost[curRow]) {
        pred[curRow] = curColumn;
        shortestPathCost[curRow] = reducedCost;
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

    if (rowAssignments[closestRow] === -1) {
      sink = closestRow;
    } else {
      curColumn = rowAssignments[closestRow];
    }
  }
  dualVariableForColumns[currUnAssCol] += delta;

  for (let sel = 0; sel < nbColumns; sel++) {
    if (scannedColumns[sel] === 0) continue;
    if (sel === currUnAssCol) continue;
    dualVariableForColumns[sel] +=
      delta - shortestPathCost[columnAssignments[sel]];
  }
  for (let sel = 0; sel < nbRows; sel++) {
    if (scannedRows[sel] === 0) continue;
    dualVariableForRows[sel] -= delta - shortestPathCost[sel];
  }

  return {
    sink,
    pred,
    dualVariableForColumns,
    dualVariableForRows,
  };
}

function getArrayOfInfinity(nbElements = 1, value = Number.POSITIVE_INFINITY) {
  const array = new Array(nbElements);
  for (let i = 0; i < nbElements; i++) {
    array[i] = value;
  }
  return array;
}
