from flask import render_template, request, Blueprint
from scipy import linalg
import numpy as np
from Functions import intvalue
import fractions, re


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

        i = 0

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
                    return render_template('form.html', value_error="True", error="Value Error", message="You entered invalid values")

            matrix_string.append(srow)
            matrix_list.append(row)

        matrix = np.array(matrix_list)

        eigvaluesraw, eigvectorsraw = linalg.eig(matrix)

        eigvectorsraw = np.transpose(eigvectorsraw)

        eigenvalues = np.array(eigvaluesraw).tolist()
        eigenvectors = np.array(eigvectorsraw, dtype='float64').tolist()





        for i in range(0, len(list(eigenvalues))):
            if eigenvalues[i].imag != 0:
                return render_template('form.html', choice="eig", imaginary="true", dim=dim, matrixString=matrix_string, error="Imaginary Solutions", message="The solution to this eigenspace produces imaginary roots!")
            else:
                eigenvalues[i] = fractions.Fraction(eigenvalues[i].real).limit_denominator()


        for i in range(0, len(list(eigenvectors))):
            k = 0
            for j in range(0, len(eigenvectors[i])):
                eigenvectors[i][j] = fractions.Fraction(eigenvectors[i][j]).limit_denominator()



                if eigenvectors[i][j] != 0:
                    k = fractions.Fraction(numerator=eigenvectors[i][j].denominator, denominator=eigenvectors[i][j].numerator).limit_denominator()

            if k != 0:
                eigenvectors[i] = np.array(eigenvectors[i]) * k

                for j in range(0, len(eigenvectors[i])):
                    if eigenvectors[i][j].denominator > 10000000:
                        eigenvectors[i][j] = fractions.Fraction(eigenvectors[i][j].numerator / eigenvectors[i][j].denominator).limit_denominator(100)





        return render_template('form.html', choice="eig", matrixString=matrix_string, eigenvalues=eigenvalues, eigenspace=eigenvectors, dim=dim, num_eigenvalues=len(list(eigenvalues)))
