import re

def intvalue(value):

    fraction = "(\d+)/(\d+)"

    reobj = re.search(fraction, value)

    return str(int(reobj.group(1)) / int(reobj.group(2)))