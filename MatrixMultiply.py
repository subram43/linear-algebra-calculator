from flask import Flask, render_template, request, Blueprint
from scipy import linalg
from Functions import intvalue
import numpy as np
import re

matmul = Blueprint('matmul', __name__)

@matmul.route("/matmulform", methods=['POST'])
def matmulform():
    if request.method == 'POST':
        m1_1 = int(request.form.get('matrixOneDimOne'))
        m1_2 = int(request.form.get('matrixOneDimTwo'))
        m2_1 = int(request.form.get('matrixTwoDimOne'))
        m2_2 = int(request.form.get('matrixTwoDimTwo'))

        choice = 'matmul'

        return render_template('form.html', choice=choice, m1_1=m1_1, m1_2=m1_2, m2_1=m2_1, m2_2=m2_2)


@matmul.route("/matmulresult", methods=['POST'])
def matmulresult():

    if request.method == 'POST':

        i=0; j=0

        while str(request.form.get("matrixOne[" + str(i) + "][0]")) != 'None':
            i += 1

        m1d1 = i

        while str(request.form.get("matrixOne[0][" + str(j) + "]")) != 'None':
            j+= 1

        m1d2 = j




        matrixOneList = []
        matrixOneString = []


        for i in range(0, m1d1):
            row = []
            srow = []

            for j in range(0, m1d2):

                input = str(request.form.get("matrixOne[" + str(i) + "][" + str(j) + "]"))

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
                except:
                    return render_template('error.html', error="Value Error", message="You entered invalid values")



            matrixOneString.append(srow)
            matrixOneList.append(row)

        i = 0; j = 0

        while str(request.form.get("matrixTwo[" + str(i) + "][0]")) != 'None':
            i += 1

        m2d1 = i

        while str(request.form.get("matrixTwo[0][" + str(j) + "]")) != 'None':
            j += 1

        m2d2 = j

        matrixTwoList = []
        matrixTwoString = []

        for i in range(0, m2d1):
            row = []
            srow = []

            for j in range(0, m2d2):

                input = str(request.form.get("matrixTwo[" + str(i) + "][" + str(j) + "]"))

                fraction = "\d+/\d+"

                try:
                    if re.match(fraction, input):
                        if re.match(fraction, input).span()[1] == len(input):

                            srow.append(input)

                            input = intvalue(input)

                            if np.abs(np.ceil(input) - input) < 0.000000000001:
                                input = np.ceil(input)
                            elif np.abs(input - np.floor(input) < 0.000000000001):
                                input = np.floor(input)

                            row.append(float(input))
                    else:
                        srow.append(input)

                        row.append(float(input))
                except:
                    return render_template('error.html', error="Value Error", message="You entered invalid values")


            matrixTwoString.append(srow)
            matrixTwoList.append(row)


        matrixOne = np.array(matrixOneList)
        matrixTwo = np.array(matrixTwoList)



        matmulresult = np.matmul(matrixOne, matrixTwo)



        return render_template('form.html', choice="matmul", matmulresult=matmulresult, matrixOneString=matrixOneString, matrixTwoString=matrixTwoString, m1_1=m1d1, m1_2=m1d2, m2_1=m2d1, m2_2=m2d2)
