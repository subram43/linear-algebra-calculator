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

        return render_template('form.html')
