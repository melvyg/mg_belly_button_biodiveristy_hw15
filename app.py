from flask import Flask, jsonify, render_template
import os

from get_bb_data import bb_sample_names, otu_desc, get_metadata_sample, get_wfreq_sample, sorted_id_samples

app = Flask(__name__)

#read all the belly button data files and store in JSON structures
sample_names = bb_sample_names()
otu_data = otu_desc()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/names")
def names():
    return jsonify(sample_names)

@app.route("/otu")
def otu():
    return jsonify(otu_data)

@app.route("/metadata/<sample>")
def metadata(sample):
    return jsonify(get_metadata_sample(sample))

@app.route("/wfreq/<sample>")
def wfreq(sample):
    return jsonify(get_wfreq_sample(sample))

@app.route("/samples/<sample>")
def samples(sample):
    return jsonify(sorted_id_samples(sample))


if __name__ == "__main__":
    app.run(debug=True)
