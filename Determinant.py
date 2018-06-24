from flask import Flask, render_template, request, Blueprint
from scipy import linalg
from Functions import intvalue
import numpy as np
import re


determinant = Blueprint('determinant', __name__)


@determinant.route("/detform", methods=['POST'])
def detForm():
    if request.method == 'POST':
        dim = int(request.form.get('detdim'))

        choice = 'det'

        return render_template("form.html", dim=dim, choice=choice)


@determinant.route("/detresult", methods=['POST'])
def detResult():
    if request.method == 'POST':

        i=0

        while str(request.form.get("num[" + str(i) + "][0]")) != 'None':
            i += 1

        dim = i

        matrix_list = []
        matrix_string = []

        for i in range(0, dim):
            row = []
            srow = []
            for j in range(0, dim):

                input = str(request.form.get("num[" + str(i) + "][" + str(j) + "]"))

                fraction = "-?\d+/\d+"

                try:
                    if re.match(fraction, input):
                        if re.match(fraction, input).span()[1] == len(input):

                            srow.append(input)

                            input = intvalue(input)
                            row.append(float(input))
                    else:

                        srow.append(input)
                        row.append(float(input))

                except ValueError:
                    return render_template('error.html', error="Value Error", message="You entered invalid values")

            matrix_string.append(srow)
            matrix_list.append(row)

        matrix = np.array(matrix_list)

        det = linalg.det(matrix)

        if np.abs(np.ceil(det) - det) < 0.000000000001:
            det = np.ceil(det)
        elif np.abs(det - np.floor(det) < 0.000000000001):
            det = np.floor(det)

        detstr = str(det)

        return render_template('form.html', choice="det", matrix=matrix_string, detstr=detstr, dim=dim)



