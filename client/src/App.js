import React from 'react';
import './App.css';
import $ from 'jquery'

function ResultOutput(props) {
  var data = props.data

  if (data == null) return null;
  if (data.error != null) {
    alert(data.error);
    return null;
  }

  var operation = props.operation;
  var result = null;

  if (operation === "det") {
    result = Math.round(data.result[0] * 100) / 100;
  } else {
    var rows = data.result.length
    var columns = typeof(data.result[0]) === "object" ? data.result[0].length : 1;

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

function InputDimensions(props) {
  var op = props.operation;
  var callbackFunction = props.onChange;
  const dimensionOptions = Array.from(Array(20), (_, i) => i + 1).map((i) => {
    return <option key={i} value={i}>{ i }</option>
  });


  if (op === 'matmul') {
    // multiple matrices
    return (
      <div className="rowParent">
        <div className="row">
          Matrix A Dimensions:
          <select className="form-control dimensions" name="matrixOneDimOne" id="m11" onChange={callbackFunction}>{dimensionOptions}</select>
          <select className="form-control dimensions" name="matrixOneDimTwo" id="m12" onChange={callbackFunction}>{dimensionOptions}</select> <br />
        </div>

        <div className="row">
          Matrix B Dimensions:
          <select className="form-control dimensions" name="matrixTwoDimOne" id="m21" onChange={callbackFunction}>{dimensionOptions}</select>
          <select className="form-control dimensions" name="matrixTwoDimTwo" id="m22" onChange={callbackFunction}>{dimensionOptions}</select> <br />
        </div>
      </div>
    );

  } else {
    // single matrix
    var matrixOneForm = <select className="form-control dimensions" name="matrixOneDimOne" id="m11" onChange={callbackFunction}>{dimensionOptions}</select>
    var matrixTwoForm = op === "rref" ? <select className="form-control dimensions" name="matrixOneDimTwo" id="m12" onChange={callbackFunction}>{dimensionOptions}</select> : null;
    return (
      <div className="rowParent">
        <div className="row">
          Matrix Dimensions: 
          {matrixOneForm}
          {matrixTwoForm}
        </div>
      </div>
    );
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      operation: null,
      matrixDimensions: {
        matrixOneDimOne: 1,
        matrixOneDimTwo: 1,
        matrixTwoDimOne: 1,
        matrixTwoDimTwo: 1,
      },
      dimensionsForm: null,
      matricesForm: null,
      matrices: {
        matrixOne: new Array(1).fill(NaN).map(() => new Array(1).fill(NaN)),
        matrixTwo: new Array(1).fill(NaN).map(() => new Array(1).fill(NaN)),
      },
      result: null,
    };

    this.handleOperationChange = this.handleOperationChange.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.handleMatrixInputChange = this.handleMatrixInputChange.bind(this);
    this.submitQuery = this.submitQuery.bind(this);
  }

  submitQuery() {
    var matrixOne = this.state.matrices.matrixOne;
    var matrixTwo = this.state.matrices.matrixTwo;
    var i, j;

    for (i = 0; i < matrixOne.length; i++) {
      for (j = 0; j < matrixOne[i].length; j++) {
        if (isNaN(matrixOne[i][j])) {
          alert('Some values in Matrix One are invalid');
          return;
        }
      }
    }

    if (this.state.operation === "matmul") {
      for (i = 0; i < matrixTwo.length; i++) {
        for (j = 0; j < matrixTwo[i].length; j++) {
          if (isNaN(matrixTwo[i][j])) {
            alert('Some values in Matrix Two are invalid');
            return;
          }
        }
      }
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.matrices),
    };

    fetch(`http://localhost:5000/${this.state.operation}`, requestOptions)
      .then(response => response.json())
      .then(data => {this.setState({result: data })});

  }

  handleMatrixInputChange(event) {
    var matrices = this.state.matrices;
    
    var inputName = event.target.name;
    var firstBracketIndex = inputName.indexOf('[');
    var matrixName = inputName.substring(0, firstBracketIndex);
    
    var indicesString = inputName.substring(firstBracketIndex);
    var indices = indicesString.substring(1, indicesString.length - 1).split("][");
    var rowIndex = parseInt(indices[0]);
    var columnIndex = parseInt(indices[1]);

    if (matrixName === "matrixOne") {
      matrices.matrixOne[rowIndex][columnIndex] = parseFloat(event.target.value);
    } else {
      matrices.matrixTwo[rowIndex][columnIndex] = parseFloat(event.target.value);
    }

    console.log(matrices);

    this.setState({
      matrices: matrices,
    });
  }

  handleDimensionChange(event) {
    var dimensionName = event.target.name;
    var dimensions = this.state.matrixDimensions;
    var changedDimensionValue = parseInt(event.target.value);
    var op = this.state.operation;

    if (dimensionName === "matrixOneDimOne") {
      dimensions.matrixOneDimOne = changedDimensionValue;

      if (op === "det" || op === "inv") {
        dimensions.matrixOneDimTwo = changedDimensionValue;
      }

    } else if (dimensionName === "matrixOneDimTwo") {
      $("#m21").val($("#m12").val()).change();
      dimensions.matrixOneDimTwo = changedDimensionValue;
      dimensions.matrixTwoDimOne = changedDimensionValue;
    
    } else if (dimensionName === "matrixTwoDimOne") {
      $("#m12").val($("#m21").val()).change();
      dimensions.matrixOneDimTwo = changedDimensionValue;
      dimensions.matrixTwoDimOne = changedDimensionValue;
    
    } else if (dimensionName === "matrixTwoDimTwo") {
      dimensions.matrixTwoDimTwo = changedDimensionValue;
    }

    var newMatrixOne = new Array(dimensions.matrixOneDimOne).fill(NaN).map(() => new Array(dimensions.matrixOneDimTwo).fill(NaN));
    var newMatrixTwo = new Array(dimensions.matrixTwoDimOne).fill(NaN).map(() => new Array(dimensions.matrixTwoDimTwo).fill(NaN));
    var oldMatrixOne = this.state.matrices.matrixOne;
    var oldMatrixTwo = this.state.matrices.matrixTwo;

    for (var i = 0; i < oldMatrixOne.length && i < newMatrixOne.length; i++) {
      for (var j = 0; j < oldMatrixOne[0].length && j < newMatrixOne[0].length; j++) {
        newMatrixOne[i][j] = oldMatrixOne[i][j];
      }
    }

    for (var k = 0; k < oldMatrixTwo.length && k < newMatrixTwo.length; k++) {
      for (var l = 0; l < oldMatrixTwo[0].length && l < newMatrixTwo[0].length; l++) {
        newMatrixTwo[k][l] = oldMatrixTwo[k][l];
      }
    }

    
    this.setState({
      matrixDimensions: dimensions,
      matricesForm: <InputMatrix dimensions={dimensions} operation={this.state.operation} onModify={this.handleMatrixInputChange} onSubmit={this.submitQuery}/>,
      matrices: {
        matrixOne: newMatrixOne,
        matrixTwo: newMatrixTwo,
      }
    });

  }
  
  handleOperationChange(event) {
    var op = event.target.value;
    var newMatrixDimensions = {
      matrixOneDimOne: 1,
      matrixOneDimTwo: 1,
      matrixTwoDimOne: 1,
      matrixTwoDimTwo: 1,
    };

    if (document.getElementById("m11") != null) document.getElementById("m11").value = 1;
    if (document.getElementById("m12") != null) document.getElementById("m12").value = 1;
    if (document.getElementById("m21") != null) document.getElementById("m21").value = 1;
    if (document.getElementById("m22") != null) document.getElementById("m22").value = 1;
    if (document.getElementById("matrixOne[0][0]") != null) document.getElementById("matrixOne[0][0]").value = null;
    if (document.getElementById("matrixTwo[0][0]") != null) document.getElementById("matrixTwo[0][0]").value = null;

    this.setState({
      operation: op,
      matrixDimensions: newMatrixDimensions,
      dimensionsForm: <InputDimensions operation={op} onChange={this.handleDimensionChange} />,
      matricesForm: <InputMatrix dimensions={newMatrixDimensions} operation={op} onModify={this.handleMatrixInputChange} onSubmit={this.submitQuery}/>,
      matrices: {
        matrixOne: new Array(1).fill(NaN).map(() => new Array(1).fill(NaN)),
        matrixTwo: new Array(1).fill(NaN).map(() => new Array(1).fill(NaN)),
      },
      result: null,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="title">
            <a className="head" href="/">Linear AlgebrA+ </a>
          </h1>

          <p>
            Welcome to <b>Linear AlgebrA+</b>, a software designed to help you perform common linear algebra problems with just a few clicks! Whether you're studying for an exam, working on a
            homework assignment, or have any other reason to solve linear algebra problems, Linear AlgebrA+ provides you with just the right tools to perform quick and efficient operations on matrices
            of up to 20 dimensions.
          </p>

          <p>
              <b>Linear AlgebrA+</b> can perform the following operations on matrices
          </p>

          <ul>
              <li>Determinant of a square matrix</li>
              <li>Matrix multiplication of two matrices</li>
              <li>Row reduced echelon form of a matrix</li>
              <li>Inverse of a square matrix</li>
          </ul>

          <p>Just select which feature you would like to use and specify the dimensions of your matrix/matrices below.</p>
          <p>Which feature would you like to use?</p>

          <div className="input-group">
            <select className="custom-select" name="choice" defaultValue="none" onChange={this.handleOperationChange}>
              <option value="none" disabled></option>
              <option value="det">determinant</option>
              <option value="matmul">matrix multiplication</option>
              <option value="rref"> reduced echelon form</option>
              <option value="inv">inverse matrix</option>
            </select>
          </div>

          {this.state.dimensionsForm}
          {this.state.matricesForm}
          <ResultOutput data={this.state.result} operation={this.state.operation}/>
              
        </header>
      </div>
    );
  }
}

export default App;
