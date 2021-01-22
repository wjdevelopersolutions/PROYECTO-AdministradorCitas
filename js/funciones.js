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
		console.log('Modo edicion!');

		// Pasar el objeto de la cita a edicion
		administrarCitas.actualizarCita({ ...citasobj });

		// Imprimir alerta
		ui.imprimirAlerta('Cita actualizada correctamente!');

		// Cambiar el texto del boton
		btnSubmit.textContent = 'Crear Cita';
		btnSubmit.classList.remove('btn-success');
		btnSubmit.classList.add('btn-primary');

		// Quitar modo edicion
		editando = false;
	} else {
		// Crear id para la nueva cita
		citasobj.id = Date.now();
		// Le pasamos una copia del objeto por que de lo contrario se duplica la informacion
		administrarCitas.crearCita({ ...citasobj });
		// Imprimir alerta
		ui.imprimirAlerta('Cita agregada correctamente!');
	}


	// Reiniciar formulario y el objeto
	formulario.reset();
	reiniciarObjeto();

	// Mostrar las citas en el HTML
	ui.imprimirCitas( administrarCitas );
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

	switch ( isTrash ) {
		case true:

			// Eliminar cita
			administrarCitas.eliminarCita(id);

			// Mustra un mensaje
			ui.imprimirAlerta('Cita eliminada correctamente');

			// Refrescar citas
			ui.imprimirCitas( administrarCitas );
			break;
		default:

			// Editar la cita por el id
			const citas = administrarCitas.obtenerCitas;
			const cita = citas.find(cita => cita.id.toString() === id);
			cargarEdicion(cita);
			break;
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
	btnSubmit.textContent = 'Guardar Cambios';
	btnSubmit.classList.remove('btn-primary');
	btnSubmit.classList.add('btn-success');

	editando = true;
}
