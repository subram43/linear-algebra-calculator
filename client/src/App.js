import React from 'react';
import './App.css';
import ResultOutput from './ResultOutput'
import InputDimensions from './InputDimensions'
import InputMatrix from './InputMatrix'
import $ from 'jquery'
import { isMatrixValuesValid, getMatrixNameAndIndices, copyMatrix, resetFormElements } from './helpers'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      operation: null,
      dimensionsForm: null,
      dimensions: {
        matrixOneDimOne: 1,
        matrixOneDimTwo: 1,
        matrixTwoDimOne: 1,
        matrixTwoDimTwo: 1,
      },
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
    var operation = this.state.operation;

    if (!isMatrixValuesValid(matrixOne) || (operation === "matmul" && !isMatrixValuesValid(matrixTwo))) {
      alert('Some values are invalid');
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.matrices),
    };

    fetch(`https://linear-algebra-plus.herokuapp.com/${this.state.operation}`, requestOptions)
      .then(response => response.json())
      .then(data => {this.setState({ result: data })});

  }

  handleMatrixInputChange(event) {
    var matrices = this.state.matrices;

    var matrixInfo = getMatrixNameAndIndices(event.target.name);
    var matrixName = matrixInfo.matrixName;
    var rowIndex = matrixInfo.rowIndex;
    var columnIndex = matrixInfo.columnIndex;

    if (matrixName === "matrixOne") {
      matrices.matrixOne[rowIndex][columnIndex] = parseFloat(event.target.value);
    } else {
      matrices.matrixTwo[rowIndex][columnIndex] = parseFloat(event.target.value);
    }

    this.setState({
      matrices: matrices,
    });
  }

  handleDimensionChange(event) {
    var dimensionName = event.target.name;
    var dimensions = this.state.dimensions;
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

    copyMatrix(oldMatrixOne, newMatrixOne);
    copyMatrix(oldMatrixTwo, newMatrixTwo);
    
    this.setState({
      dimensions: dimensions,
      matricesForm: <InputMatrix dimensions={dimensions} operation={this.state.operation} onModify={this.handleMatrixInputChange} onSubmit={this.submitQuery}/>,
      matrices: {
        matrixOne: newMatrixOne,
        matrixTwo: newMatrixTwo,
      }
    });

  }
  
  handleOperationChange(event) {
    var op = event.target.value;
    var newDimensions = {
      matrixOneDimOne: 1,
      matrixOneDimTwo: 1,
      matrixTwoDimOne: 1,
      matrixTwoDimTwo: 1,
    };

    resetFormElements({
      "m11": 1,
      "m12": 1,
      "m21": 1,
      "m22": 1,
      "matrixOne[0][0]": null,
      "matrixTwo[0][0]": null,
    });

    this.setState({
      operation: op,
      dimensions: newDimensions,
      dimensionsForm: <InputDimensions operation={op} onChange={this.handleDimensionChange} />,
      matricesForm: <InputMatrix dimensions={newDimensions} operation={op} onModify={this.handleMatrixInputChange} onSubmit={this.submitQuery}/>,
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
