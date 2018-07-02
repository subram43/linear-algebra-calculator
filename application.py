from flask import Flask, render_template, request
from Determinant import determinant
from MatrixMultiply import matmul
from Inverse import inverse
from Eigenspace import eigenspace
from Rref import rref

application = Flask(__name__)
application.register_blueprint(determinant)
application.register_blueprint(matmul)
application.register_blueprint(inverse)
application.register_blueprint(eigenspace)
application.register_blueprint(rref)

@application.route("/")
def index():

    selected = -1
    return render_template("index.html", selected=selected)

@application.route("/dimensions", methods=['POST', 'GET'])
def dimensions():
    if request.method == 'POST':
        res = str(request.form.get('choice'))

        selected = -1

        if res == 'det':
            selected = 0

        elif res == 'matmul':
            selected = 1

        elif res == 'rref':
            selected = 2

        elif res == 'inv':
            selected = 3

        elif res == 'eig':
            selected = 4

        return render_template("index.html", res=res, selected=selected)

@application.after_request
def clear_cache(req):

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers["Cache-Control"] = "public, max-age=0"
    return req


if __name__ == '__main__':
    application.run()

