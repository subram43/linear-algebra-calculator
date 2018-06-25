from flask import Flask, render_template, request, Blueprint
from scipy import linalg
import numpy as np
from scipy.sparse.linalg import eigs

from Functions import intvalue
import fractions, re, collections


eigenspace = Blueprint('eigenspace', __name__)


@eigenspace.route("/eigform", methods=['POST'])
def eigform():
    if request.method == 'POST':
        dim = int(request.form.get('eigdim'))

        choice = 'eig'

        return render_template('form.html', dim=dim, choice=choice)


@eigenspace.route("/eigresult", methods=['POST'])
def eigresult():
    if request.method == 'POST':

        i=0

        while str(request.form.get("matrix[" + str(i) + "][0]")) != 'None':
            i += 1

        dim = i

        matrix_list = []
        matrix_string = []

        for i in range(0, dim):
            row = []
            srow = []
            for j in range(0, dim):

                input = str(request.form.get("matrix[" + str(i) + "][" + str(j) + "]"))

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

        eigvaluesraw, eigvectorsraw = linalg.eig(matrix)

        eigvaluesraw = np.array(eigvaluesraw).tolist()


        for i in range(0, len(eigvaluesraw)):
            if eigvaluesraw[i].imag != 0:
                render_template('error.html', error="Value Error", message="You entered invalid values")
            else:
                eigvaluesraw[i] = fractions.Fraction(eigvaluesraw[i].real).limit_denominator()

        multiplicities = collections.Counter(eigvaluesraw)

        eigenvalues = list(multiplicities.keys())

        h = eigenvalues[0]
        num_eigenvalues = len(eigenvalues)

        eigenvectors = []

        for i in range(0, len(eigenvalues)):
            eigenvectors.append(list(eigs(matrix, k=eigenvalues[i])))

        return render_template('form.html', choice="eig", matrixString=matrix_string, eigenvalues=eigenvalues, eigenspace=eigenvectors, dim=dim, num_eigenvalues=num_eigenvalues)

