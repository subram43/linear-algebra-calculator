from flask import Flask, render_template, request, Blueprint
from scipy import linalg
from Functions import intvalue
import numpy as np
import fractions
import re

rref = Blueprint('rref', __name__)

@rref.route("/rrefform", methods=['POST'])
def rrefform():
    if request.method == 'POST':
        return render_template('index.html')