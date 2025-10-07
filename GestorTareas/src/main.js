import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter, initTaskManager } from "./function.js";

// Importante: este fichero monta la estructura HTML (markup) y arranca la
// lógica del gestor. Separar markup (aquí) y lógica (en `function.js`) ayuda
// a mantener el código organizado.

// Seleccionamos el contenedor principal donde inyectaremos el HTML
const appContainer = document.querySelector('#app');

// Montar el HTML del gestor en `#app`.
// Nota: la imagen del gato está antes del contenido para que el DOM la tenga
// disponible; su posicionamiento visual lo controla CSS (`#catImage`).
appContainer.innerHTML = `
<img id="catImage" src="/resources/broderCat.png" alt="Gato" />
	<div>
		<h1>Gestor de tareas</h1>
		<div class="card task-card">
			<div class="task-add">
				<input id="taskInput" placeholder="Escribe una tarea" />
				<button id="addTaskButton">Añadir tarea</button>
			</div>
			<ul id="taskList" class="task-list"></ul>
		</div>
		
	</div>
`;

// Inicializar la lógica: carga tareas (localStorage), enlaza eventos y renderiza
initTaskManager(appContainer);

// OPTIONAL: ejemplo de módulo pequeño (`setupCounter`) que se inicializa
// solo si existe un elemento con id `#counter`.
// const counterEl = document.querySelector("#counter");
// if (counterEl) setupCounter(counterEl);


