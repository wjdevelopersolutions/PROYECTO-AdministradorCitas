import Cita from './clases/Cita.js';
import UI from './clases/Ui.js';

import {
	mascotaInput,
	propietarioInput,
	tipoInput,
	telefonoInput,
	fechaInput,
	horaInput,
	sintomasInput,
	formulario,
	btnSubmit
} from './selectores.js';

const ui = new UI();
const administrarCitas = new Cita();

let editando;
export let DB;

window.onload = () => {
	crearDB();
}

/**
 * Objeto con la informacion de la cita
 */
const citasobj = {
	mascota: '',
	tipo: 'no definido',
	propietario: '',
	telefono: '',
	fecha: '',
	hora: '',
	sintomas: ''
}

export function empezarCitaFunc() {
	
	// Fija el focus en el input de mascota para empezar a escribir la cita
	mascotaInput.focus();
}


/**
 * Agrega datos al objeto de la cita
 */
export function datosCita(event) {
	citasobj[event.target.name] = event.target.value;
}


/**
 * Valida y agrega una nueva cita a la clase de cita
 */
export function nuevaCita(event) {
	event.preventDefault();
	const { mascota, tipo, propietario, telefono, fecha, hora, sintomas } = citasobj;

	if ( mascota === '' || tipo === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
		ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
		return;
	}

	if ( editando ) {
		// console.log('Modo edicion!');

		// Pasar el objeto de la cita a edicion
		administrarCitas.actualizarCita({ ...citasobj });

		// Edita en IndexDB
		const transaction = DB.transaction(['citas'], 'readwrite');
		const objectStore = transaction.objectStore('citas');
		objectStore.put(citasobj);

		transaction.oncomplete = function() {
			// Imprimir alerta
			ui.imprimirAlerta('Cita actualizada correctamente!');

			// Cambiar el texto del boton
			const icon = ` 
				<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-border-inner" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
	                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
	                <line x1="4" y1="12" x2="20" y2="12" />
	                <line x1="12" y1="4" x2="12" y2="20" />
	                <line x1="4" y1="4" x2="4" y2="4.01" />
	                <line x1="8" y1="4" x2="8" y2="4.01" />
	                <line x1="16" y1="4" x2="16" y2="4.01" />
	                <line x1="20" y1="4" x2="20" y2="4.01" />
	                <line x1="4" y1="8" x2="4" y2="8.01" />
	                <line x1="20" y1="8" x2="20" y2="8.01" />
	                <line x1="4" y1="16" x2="4" y2="16.01" />
	                <line x1="20" y1="16" x2="20" y2="16.01" />
	                <line x1="4" y1="20" x2="4" y2="20.01" />
	                <line x1="8" y1="20" x2="8" y2="20.01" />
	                <line x1="16" y1="20" x2="16" y2="20.01" />
	                <line x1="20" y1="20" x2="20" y2="20.01" />
              	</svg>
              	Crear Cita
			`
			btnSubmit.innerHTML = icon;
			btnSubmit.classList.remove('btn-success');
			btnSubmit.classList.add('btn-primary');

			// Quitar modo edicion
			editando = false;
		}

		transaction.onerror = function() {
			console.log('Hubo un error al editar la cita');
		}

	} else {
		// Crear id para la nueva cita
		citasobj.id = Date.now();
		// Le pasamos una copia del objeto por que de lo contrario se duplica la informacion
		administrarCitas.crearCita({ ...citasobj });

		// Insertar registro en IndexDB
		const transaction = DB.transaction(['citas'], 'readwrite');
		// habilitar el objectStore
		const objectStore = transaction.objectStore('citas');
		// Insertar en la DB
		objectStore.add(citasobj);

		transaction.oncomplete = function() {

			// Imprimir alerta
			console.log('Cita agregada a la DB exitosamente!');
			ui.imprimirAlerta('Cita agregada correctamente!');
		};
	}


	// Reiniciar formulario y el objeto
	formulario.reset();
	reiniciarObjeto();

	// Mostrar las citas en el HTML
	ui.imprimirCitas();
}

// Reiniciar el objeto
export function reiniciarObjeto() {
	citasobj.mascota = '';
	citasobj.tipo = '',
	citasobj.propietario = '';
	citasobj.telefono = '';
	citasobj.fecha = '';
	citasobj.hora = '';
	citasobj.sintomas = '';
}

// Item Citas Action
export function itemCitaAction(event) {

	if ( event.target.className.baseVal === undefined ) {
		console.log('Hiciste click fuera de los botones');
		return;
	}

	const id = this.dataset.id;
	const isTrash = event.target.className.baseVal.includes('icon-tabler-trash');

	if ( isTrash ) {
		const transaction = DB.transaction(['citas'], 'readwrite');
		const objectStore = transaction.objectStore('citas');
		objectStore.delete(parseInt(id));

		transaction.oncomplete = function() {
			console.log(`Cita ${id} eliminana!`);
			// Mustra un mensaje
			ui.imprimirAlerta('Cita eliminada correctamente');
			// Refrescar citas
			ui.imprimirCitas();
		}

		transaction.onerror = function() {
			console.log('Hubo un error al eliminar la cita');
		}
	} else {
		const objectStore = DB.transaction('citas').objectStore('citas');
		objectStore.openCursor().onsuccess = function(event) {
			const cursor = event.target.result;

			if ( cursor ) {
				if (cursor.value.id === parseInt(id)) {
					cargarEdicion(cursor.value);
				}
				cursor.continue();
			} 
		}
	}

}

export function cargarEdicion(cita) {

	const { mascota, tipo, propietario, telefono, fecha, hora, sintomas, id } = cita;

	// Llenar los inputs
	mascotaInput.value = mascota;
	tipoInput.value = tipo;
	propietarioInput.value = propietario;
	telefonoInput.value = telefono;
	fechaInput.value = fecha;
	horaInput.value = hora;
	sintomasInput.value = sintomas;

	// Llenar el Objeto
	citasobj.mascota = mascota;
	citasobj.tipo = tipo;
	citasobj.propietario = propietario;
	citasobj.telefono = telefono;
	citasobj.fecha = fecha;
	citasobj.hora = hora;
	citasobj.sintomas = sintomas;
	citasobj.id = id;

	// Cambiar el texto del boton
	const icon = ` 
		<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-floppy" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="#fff" stroke-linecap="round" stroke-linejoin="round">
		  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
		  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
		  <circle cx="12" cy="14" r="2" />
		  <polyline points="14 4 14 8 8 8 8 4" />
		</svg>
		Guardar Cambios
	`;
	btnSubmit.innerHTML = icon;
	btnSubmit.classList.remove('btn-primary');
	btnSubmit.classList.add('btn-success');

	editando = true;
}

function crearDB() {

	// Crear la base de datos v1
	const crearDB = window.indexedDB.open('citas', 1);
	
	// Si hay un error 
	crearDB.onerror = () => {
		console.log('Hubo un error');
	}
	
	// Si todo sale bien
	crearDB.onsuccess = () => {
		// console.log('Base de datos creada!');
		DB = crearDB.result;

		// Mostrar citas al cargar pero indexDB ya esta listo
		ui.imprimirCitas();
	}

	// Definir schema
	crearDB.onupgradeneeded = (event) => {

		const db = event.target.result;
		const objectStore = db.createObjectStore('citas', {
			keyPath: 'id',
			autoIncrement: true
		});

		// Definir las columnas
		objectStore.createIndex('mascota', 'mascota', { unique: false });
		objectStore.createIndex('tipo', 'tipo', { unique: false });
		objectStore.createIndex('propietario', 'propietario', { unique: false });
		objectStore.createIndex('telefono', 'telefono', { unique: false });
		objectStore.createIndex('fecha', 'fecha', { unique: false });
		objectStore.createIndex('hora', 'hora', { unique: false });
		objectStore.createIndex('sintomas', 'sintomas', { unique: false });
		objectStore.createIndex('id', 'id', { unique: true });

		console.log('DB Creada y Lista!');
	}
}
