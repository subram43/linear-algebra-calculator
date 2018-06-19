from flask import Flask, render_template, request

application = Flask(__name__)

@application.route("/")
def index():

    # dim = (3, 2)

    return render_template("index.html")



@application.route("/dimensions", methods=['POST', 'GET'])
def dimensions():
    if request.method == 'POST':
        res = str(request.form.get('choice'))
        return render_template("dimensions.html", res=res)


if __name__ == '__main__':
    application.run()

