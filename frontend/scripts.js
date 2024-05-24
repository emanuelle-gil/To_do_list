const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const tasks_list = document.querySelector('.list-tasks');

function add_task() {
    const novaTarefa = {
        task: input.value,
        status: false
    };

    fetch('http://127.0.0.1:5000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaTarefa)
    })
        .then(response => {
            if (response.ok) {
                input.value = '';
                recarregarTarefas();
            } else {
                throw new Error('Erro ao adicionar tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function mostrarTarefas(tarefas) {
    let novaLi = '';

    tarefas.forEach((item) => {
        novaLi +=
            `
    <li class="task ${item.status && 'done'}">
      <img src="./img/check.png" alt="check-na-tarefa" onclick="concluirTarefa('${item.id}')">
      <p>${item.task}</p>
      <img src="./img/delete.png" alt="tarefa-para-o-lixo" onclick="deletarItem('${item.id}')">
    </li>
    `;
    });

    tasks_list.innerHTML = novaLi;
}

function concluirTarefa(taskId) {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}/complete`, {
        method: 'PUT'
    })
        .then(response => {
            if (response.ok) {
                recarregarTarefas();
            } else {
                throw new Error('Erro ao concluir tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function deletarItem(taskId) {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                recarregarTarefas();
            } else {
                throw new Error('Erro ao deletar tarefa');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function recarregarTarefas() {
    fetch('http://127.0.0.1:5000/tasks')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao carregar tarefas');
            }
        })
        .then(tarefas => {
            mostrarTarefas(tarefas);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

recarregarTarefas();
button.addEventListener('click', add_task);
