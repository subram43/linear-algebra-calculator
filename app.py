from flask import Flask, render_template, request
from scipy import linalg
import numpy as np
import re

application = Flask(__name__)


@application.route("/")
def index():

    # dim = (3, 2)
    selected = -1
    return render_template("index.html", selected = selected)

@application.route("/dimensions", methods=['POST', 'GET'])
def dimensions():
    if request.method == 'POST':
        res = str(request.form.get('choice'))

        selected = -1

        if res == 'det':
            selected = 0

        elif res == 'matmul':
            selected = 1

        elif res == 'eig':
            selected = 2

        return render_template("index.html", res=res, selected=selected)



@application.route("/detform", methods=['POST'])
def detForm():
    if request.method == 'POST':
        dim = int(request.form.get('detdim'))

        choice = 'det'

        return render_template("form.html", dim=dim, choice=choice)


@application.route("/detresult", methods=['POST'])
def detResult():
    if request.method == 'POST':

        det = str(request.form.get('num[564][4564]'))

        i=0

        while str(request.form.get("num[" + str(i) + "][0]")) != 'None':
            i += 1

        dim = i

        matrixList = []

        for i in range(0, dim):
            row = []
            for j in range(0, dim):

                input = str(request.form.get("num[" + str(i) + "][" + str(j) + "]"))

                fraction = "\d+/\d+"

                if re.match(fraction, input):
                    if re.match(fraction, input).span()[1] == len(input):
                        input = intvalue(input)
                        row.append(float(input))
                else:
                    row.append(float(input))

            matrixList.append(row)

        matrix = np.array(matrixList)

        det = linalg.det(matrix)

        if np.abs(np.ceil(det) - det) < 0.000000000001:
            det = np.ceil(det)
        elif np.abs(det - np.floor(det) < 0.000000000001):
            det = np.floor(det)

        detstr = str(det)

        return render_template('form.html', detstr=detstr)


def intvalue(value):

    fraction = "(\d+)/(\d+)"

    reobj = re.search(fraction, value)

    return str(int(reobj.group(1)) / int(reobj.group(2)))


if __name__ == '__main__':
    application.run()

