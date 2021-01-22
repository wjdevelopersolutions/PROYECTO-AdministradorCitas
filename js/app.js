const mascotaInput = document.querySelector('#mascota');
const tipoInput = document.querySelector('#tipo');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

const btnSubmit = formulario.querySelector('button[type="submit"]');
let editando;

/**
 * Clases
 */

class Cita {

	citas;

	constructor() {
		this.citas = [];
	}

	get obtenerCitas() {
		return this.citas;
	}

	crearCita( cita ) {
		this.citas = [...this.citas, cita];
	}

	actualizarCita( citaActualizada ) {
		this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita )
	}

	eliminarCita(id) {
		this.citas = this.citas.filter(cita => cita.id.toString() !== id);
	}
}

class UI {
	imprimirAlerta(mensaje, tipo) {
		const div = document.createElement('div');
		div.classList.add('alert', 'alert-dismissible', 'text-center');

		if ( tipo === 'error' ) {
			div.classList.add('alert-danger', 'animate__animated', 'animate__fadeIn');
			div.innerHTML = `
				<button type="button" class="close" data-dismiss="alert">&times;</button>
  				<a href="#" class="alert-link">Algo va mal</a> ${mensaje}.
			`
		} else {
			div.classList.add('alert-success', 'animate__animated', 'animate__fadeIn');
			div.innerHTML = `
				<button type="button" class="close" data-dismiss="alert">&times;</button>
  				<strong>Notificacion:</strong><a href="#" class="alert-link">&nbsp;${mensaje}</a>.
			`
		}

		// Agregar mensaje al DOM
		document.querySelector('.container').insertBefore(div, document.querySelector('#contenido'));

		setTimeout(() => {
			// div.classList.remove('animate__fadeIn');
			div.classList.add('animate__fadeOut');
			div.addEventListener('animationend', () => {
			  // do something
			  div.remove();
			});
		}, 3000);
	}

	imprimirCitas({ citas }) {

		// Limpiar citas
		this.limpiarHTML();

		citas.forEach(cita => {

			const { mascota, tipo, propietario, telefono, fecha, hora, sintomas, id } = cita;

			const li = document.createElement('li');
			li.classList.add('cita', 'list-group');

			const a = document.createElement('A');
			a.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
			a.dataset.id = id;
			a.innerHTML = `
				<div class="d-flex w-100 justify-content-between">
					<h5 class="mb-1">${mascota} <small>${tipo}</small></h5>
					<small class="text-muted">${fecha} ${hora}</small>
				</div>
				<p class="mb-1">${sintomas}</p>
				<div class="d-flex justify-content-between">
					<small class="text-muted">${propietario} / ${telefono}</small>
					<div>
						<svg class="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							<line x1="4" y1="7" x2="20" y2="7" />
							<line x1="10" y1="11" x2="10" y2="17" />
							<line x1="14" y1="11" x2="14" y2="17" />
							<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
							<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
						</svg>
					</div>
				</div>
			`;
			a.onclick = itemCitaAction;


			// Agregar las citas al HTML
			li.appendChild(a);
			contenedorCitas.appendChild(li);
		});
	}

	limpiarHTML() {
		while( contenedorCitas.firstChild ) {
			contenedorCitas.removeChild(contenedorCitas.firstChild);
		}
	}
}

const ui = new UI();
const administrarCitas = new Cita();

/**
 * Registrar eventos
 */
eventListeners()
function eventListeners() {

	mascotaInput.addEventListener('change', datosCita);
	tipoInput.addEventListener('change', datosCita);
	propietarioInput.addEventListener('change', datosCita);
	telefonoInput.addEventListener('change', datosCita);
	fechaInput.addEventListener('change', datosCita);
	horaInput.addEventListener('change', datosCita);
	sintomasInput.addEventListener('change', datosCita);

	formulario.addEventListener('submit', nuevaCita);

}

/**
 * Objeto con la informacion de la cita
 */
const citasobj = {
	mascota: 'Spike',
	tipo: 'no definido',
	propietario: 'Wilson Juma',
	telefono: '8298159560',
	fecha: '20210122',
	hora: '10:00 am',
	sintomas: 'Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.'
}

/**
 * Agrega datos al objeto de la cita
 */
function datosCita(event) {
	citasobj[event.target.name] = event.target.value;
}

/**
 * Valida y agrega una nueva cita a la clase de cita
 */
function nuevaCita(event) {
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
function reiniciarObjeto() {
	citasobj.mascota = '';
	citasobj.tipo = '',
	citasobj.propietario = '';
	citasobj.telefono = '';
	citasobj.fecha = '';
	citasobj.hora = '';
	citasobj.sintomas = '';
}

// Item Citas Action
function itemCitaAction(event) {

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

function cargarEdicion(cita) {

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
