from flask import Flask, render_template, request
from scipy import linalg
import numpy as np
import re

application = Flask(__name__)


@application.route("/")
def index():

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

        i=0

        while str(request.form.get("num[" + str(i) + "][0]")) != 'None':
            i += 1

        dim = i

        matrixList = []
        matrixString = []

        for i in range(0, dim):
            row = []
            srow = []
            for j in range(0, dim):

                input = str(request.form.get("num[" + str(i) + "][" + str(j) + "]"))

                fraction = "\d+/\d+"

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

            matrixString.append(srow)
            matrixList.append(row)

        matrix = np.array(matrixList)

        det = linalg.det(matrix)

        if np.abs(np.ceil(det) - det) < 0.000000000001:
            det = np.ceil(det)
        elif np.abs(det - np.floor(det) < 0.000000000001):
            det = np.floor(det)

        detstr = str(det)

        return render_template('form.html', choice="det", matrix=matrixString, detstr=detstr, dim=dim)


@application.after_request
def clear_cache(req):

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers["Cache-Control"] = "public, max-age=0"
    return req


def intvalue(value):

    fraction = "(\d+)/(\d+)"

    reobj = re.search(fraction, value)

    return str(int(reobj.group(1)) / int(reobj.group(2)))


if __name__ == '__main__':
    application.run()

