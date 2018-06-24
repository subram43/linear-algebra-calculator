from flask import Flask, render_template, request, Blueprint
from scipy import linalg
from Functions import intvalue
import numpy as np
import re


inverse = Blueprint('inverse', __name__)


@inverse.route("/invform", methods=['POST'])
def invform():
    if request.method == 'POST':
        dim = int(request.form.get('invdim'))

        choice = "inv"

        return render_template('form.html', dim=dim, choice=choice)


@inverse.route("/invresult", methods=['POST'])
def invresult():
    if request.method == 'POST':

        i=0

        while str(request.form.get("matrix[" + str(i) + "][0]")) != 'None':
            i += 1

        dim = i

        matrixList = []
        matrixString = []

        for i in range(0, dim):
            row = []
            srow = []

            for j in range(0, dim):

                input = request.form.get("matrix[" + str(i) + "][" + str(j) + "]")

                fraction = "\d+/\d+"

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

            matrixString.append(srow)
            matrixList.append(row)

        matrix = np.array(matrixList)

        try:
            inv = np.linalg.inv(matrix)

            inv = inv.round(5)
        except np.linalg.LinAlgError:
            return render_template('form.html', choice="inv", dim=dim, matrixString=matrixString, singular="true", error="Matrix Error", message="The matrix you entered is singular, so the inverse cannot be found")

        return render_template('form.html', choice="inv", matrixString=matrixString, inv=inv, dim=dim)