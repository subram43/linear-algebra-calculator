from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from scipy import linalg
import numpy as np
import sympy

application = Flask(__name__)
cors = CORS(application)

@application.route("/det", methods=['POST'])
def detresult():
  if request.method == 'POST':

    matrix = np.array(request.json['matrixOne'])

    det = linalg.det(matrix)

    return jsonify({'result': [det]})

@application.route("/matmul", methods=['POST'])
def matmulresult():
  if request.method == 'POST':

    matrix_one = np.array(request.json['matrixOne'])
    matrix_two = np.array(request.json['matrixTwo'])

    matmulresult = np.matmul(matrix_one, matrix_two).tolist()

    return jsonify({'result': matmulresult})

@application.route("/inv", methods=['POST'])
def invresult():
  if request.method == 'POST':

    matrix = np.array(request.json['matrixOne'])

    try:
      inv = np.linalg.inv(matrix).tolist()

    except np.linalg.LinAlgError:
        return jsonify({'result': [[]], 'error': 'The matrix you entered is singular. Inverse does not exist'})

    return jsonify({'result': inv, 'error': None})

@application.route("/rref", methods=['POST'])
def rrefresult():
  if request.method == 'POST':
    matrix = sympy.Matrix(request.json['matrixOne'])
    rref = np.array(matrix.rref()[0]).astype(np.float).tolist()
    print(rref)

    return jsonify({'result': rref})


@application.after_request
def clear_cache(req):
  req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  req.headers["Pragma"] = "no-cache"
  req.headers["Expires"] = "0"
  req.headers["Cache-Control"] = "public, max-age=0"
  return req


if __name__ == '__main__':
  application.run()

