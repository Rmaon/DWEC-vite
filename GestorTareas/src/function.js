// setupCounter: ejemplo pequeño que mantiene y muestra un contador
// Input: HTML element donde se mostrará el contador.
// Comportamiento: al hacer click en el elemento, incrementa el contador.
export function setupCounter(element) {
  let counter = 0;

  // Actualiza el contenido del elemento con el contador actual
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };

  // Incrementa el contador al hacer click
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

// initTaskManager monta el gestor de tareas dentro de un elemento contenedor
// initTaskManager: enlaza la lógica del gestor de tareas con elementos
// ya presentes en el DOM (no crea HTML).
// Contracto / API:
// - Entrada: `container` (elemento que contiene el markup del gestor).
// - Efecto: gestiona la lista de tareas (persistencia local, render, eventos).
export function initTaskManager(container) {
  if (!container) return;

  // Clave usada en localStorage para persistencia
  const STORAGE_KEY = 'tasks-v1';

  // loadTasks: devuelve un array de tareas desde localStorage o []
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      // En caso de JSON inválido u otro error, devolvemos lista vacía
      console.error('Error leyendo tareas desde localStorage', e);
      return [];
    }
  }

  // saveTasks: serializa y guarda el array de tareas
  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error guardando tareas en localStorage', e);
    }
  }

  // renderTasks: actualiza el DOM de la lista (`#taskList`) a partir del array
  function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    if (tasks.length === 0) {
      const el = document.createElement('li');
      el.className = 'empty';
      el.textContent = 'No hay tareas. Añade una �';
      list.appendChild(el);
      return;
    }

    // Por cada tarea, creamos el su HTML y eventos asociados
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      // Checkbox para marcar completada
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!task.completed;
      checkbox.className = 'task-checkbox';
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        renderTasks(tasks);
      });

      // Label con el título
      const label = document.createElement('span');
      label.className = 'task-label';
      label.textContent = task.title;
      if (task.completed) label.classList.add('completed');

      // Botón para eliminar la tarea
      const del = document.createElement('button');
      del.className = 'task-delete';
      del.textContent = 'Eliminar';
      del.addEventListener('click', () => {
        const idx = tasks.findIndex(t => t.id === task.id);
        if (idx !== -1) {
          tasks.splice(idx, 1);
          saveTasks(tasks);
          renderTasks(tasks);
        }
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  // addTask: añade una tarea nueva (valida título), guarda y renderiza
  function addTask(title) {
    if (!title || !title.trim()) return;
    const tasks = loadTasks();
    const task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
    };
    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);
  }

  // Enlaces a elementos del DOM (se asume existen en la página)
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addTaskButton');

  // Evento: click en 'Añadir tarea'
  addBtn.addEventListener('click', () => {
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  // Evento: pulsar Enter en el input
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask(input.value);
      input.value = '';
    }
  });

  // Renderiza la lista inicial al arrancar
  renderTasks(loadTasks());
}

