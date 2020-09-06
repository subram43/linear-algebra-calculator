import React from 'react'
import './App.css';

function ResultOutput(props) {
  var data = props.data

  if (data == null) {
    return null;
  } else if (data.error != null) {
    alert(data.error);
    return null;
  }

  var operation = props.operation;
  var result = null;

  if (operation === "det") {
    result = Math.round(data.result[0] * 100) / 100;
  } else {
    var rows = data.result.length
    var columns = data.result[0].length;

    var matrixResult = Array.from(Array(rows), (_, i) => i).map((i) => {
      var columnsResult = Array.from(Array(columns), (_, j) => j).map((j) => {
        return (
          <td key={`${i},${j}`}>
            {Math.round(data.result[i][j] * 100) / 100}
          </td>
        );
      });

      return (
        <tr key={i}>
          {columnsResult}
        </tr>
      );
    });

    result = <table className="matrix result"><tbody>{matrixResult}</tbody></table>

  }

  return (
    <div className="row">
      Answer = {result}
    </div>
  );
}

export default ResultOutput;