from flask import Flask, render_template, request, Blueprint
from scipy import linalg
from Functions import intvalue
import numpy as np
import fractions
import sympy
import re

rref = Blueprint('rref', __name__)

@rref.route("/rrefform", methods=['POST'])
def rrefform():
    if request.method == 'POST':
        dim1 = int(request.form.get('dim1'))
        dim2 = int(request.form.get('dim2'))

        choice = 'rref'

        return render_template('form.html', dim1=dim1, dim2=dim2, choice=choice)


@rref.route("/rrefresult", methods=['POST'])
def rrefresult():
    if request.method == 'POST':

        i = 0; j = 0

        while str(request.form.get("matrix[" + str(i) + "][0]")) != 'None':
            i += 1

        dim1 = i

        while str(request.form.get("matrix[0][" + str(j) + "]")) != 'None':
            j += 1

        dim2 = j

        matrix_list = []
        matrix_string = []

        for i in range(0, dim1):
            row = []
            srow = []
            for j in range(0, dim2):

                input = str(request.form.get("matrix[" + str(i) + "][" + str(j) + "]"))

                fraction = "-?\d+/\d+"

                try:
                    if re.match(fraction, input):
                        if re.match(fraction, input).span()[1] == len(input):
                            srow.append(input)

                            input = intvalue(input)

                            if np.abs(np.ceil(float(input)) - float(input)) < 0.000000000001:
                                input = np.ceil(input)
                            elif np.abs(float(input) - np.floor(float(input)) < 0.000000000001):
                                input = np.floor(float(input))

                            row.append(float(input))

                    else:

                        srow.append(input)
                        row.append(float(input))
                except ValueError:
                    return render_template('error.html', error="Value Error", message="You entered invalid values")

            matrix_string.append(srow)
            matrix_list.append(row)

        matrix = sympy.Matrix(matrix_list)

        rref = np.array(matrix.rref()[0]).astype(np.float).tolist()

        for i in range(0, dim1):

            for j in range(0, dim2):
                rref[i][j] = fractions.Fraction(rref[i][j]).limit_denominator()


        return render_template('form.html', choice="rref", dim1=dim1, dim2=dim2, rref=rref, matrix_string=matrix_string)
