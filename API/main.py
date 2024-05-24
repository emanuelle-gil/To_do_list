from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("API/privatekey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    data['status'] = False
    db.collection('tasks').add(data)
    return jsonify({"message": "Tarefa adicionada com sucesso!"}), 201

@app.route('/tasks/<task_id>', methods=['DELETE'])
def remove_task(task_id):
    db.collection('tasks').document(task_id).delete()
    return jsonify({"message": "Tarefa removida com sucesso!"}), 200

@app.route('/tasks/<task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    db.collection('tasks').document(task_id).update({"status": True})
    return jsonify({"message": "Status alterado com sucesso!"}), 200

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = []
    docs = db.collection('tasks').stream()
    for doc in docs:
        task = doc.to_dict()
        task['id'] = doc.id
        tasks.append(task)
    return jsonify(tasks), 200

if __name__ == '__main__':
    app.run(debug=True)
