import React from 'react'
import './App.css';

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

export default InputDimensions;