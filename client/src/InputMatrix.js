import React from 'react'
import './App.css';

class InputMatrix extends React.Component {

  createMatrixForm(name, dimension1, dimension2) {
    var matrixForm = Array.from(Array(dimension1), (_, i) => i).map((i) => {
      var columnsForm = Array.from(Array(dimension2), (_, j) => j).map((j) => {
        return (
          <td key={`${i},${j}`}>
            <input className="form-control" type="number" name={`${name}[${i}][${j}]`} id={`${name}[${i}][${j}]`} onChange={this.props.onModify} />
          </td>
        );
      });

      return (
        <tr key={i}>
          {columnsForm}
        </tr>
      );
    });

    return (
      <table className="matrix">
        <tbody>
          {matrixForm}
        </tbody>
      </table>
    );
  }

  render() {
    var op = this.props.operation;
    var dimensions = this.props.dimensions;

    var matrixOneTable = this.createMatrixForm("matrixOne", dimensions.matrixOneDimOne, dimensions.matrixOneDimTwo);
    var matrixTwoTable = op === "matmul" ? this.createMatrixForm("matrixTwo", dimensions.matrixTwoDimOne, dimensions.matrixTwoDimTwo) : null;
    
    return (
      <div>
        {matrixOneTable}
        {matrixTwoTable}

        <button className="btn btn-primary" type="submit" onClick={this.props.onSubmit}>Submit</button>
      </div>
    );
  }
}

export default InputMatrix;