
export function isMatrixValuesValid(matrix) {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (isNaN(matrix[i][j])) {
        return false;
      }
    }
  }

  return true;
}

export function getMatrixNameAndIndices(htmlName) {
  var firstBracketIndex = htmlName.indexOf('[');
  var indicesString = htmlName.substring(firstBracketIndex);
  var indices = indicesString.substring(1, indicesString.length - 1).split("][");

  return {
    matrixName: htmlName.substring(0, firstBracketIndex),
    rowIndex: parseInt(indices[0]),
    columnIndex: parseInt(indices[1]),
  };
}

export function copyMatrix(src, dest) {
  for (var i = 0; i < src.length && i < dest.length; i++) {
    for (var j = 0; j < src[0].length && j < dest[0].length; j++) {
      dest[i][j] = src[i][j];
    }
  }
}

export function resetFormElements(elements) {
  Object.keys(elements).forEach((key) => {
    var resetValue = elements[key];
    if (document.getElementById(key) != null) document.getElementById(key).value = resetValue;
  });
}