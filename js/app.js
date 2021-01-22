const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

/**
 * Clases
 */

class Cita {

	citas = [];

	constructor() {}

	get citas() {
		return this.citas;
	}

	set crear( cita ) {
		this.citas = [...this.citas, cita];
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
  				<strong>Oh snap!</strong> <a href="#" class="alert-link">Algo va mal</a> ${mensaje}.
			`
		} else { 
			div.classList.add('alert-success');
			div.innerHTML = `
				<button type="button" class="close" data-dismiss="alert">&times;</button>
  				<strong>Well done!</strong><a href="#" class="alert-link">Cita guardada</a> ${mensaje}.
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

			const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
			const li = document.createElement('li');
			li.classList.add('cita', 'list-group');
			li.innerHTML = ` 
				 <a href="cita/${id}" data-id=${id} class="list-group-item list-group-item-action flex-column align-items-start">
				    <div class="d-flex w-100 justify-content-between">
				      <h5 class="mb-1">${mascota} <small>Perro</small></h5>
				      <small class="text-muted">${fecha} ${hora}</small>
				    </div>
				    <p class="mb-1">${sintomas}</p>
				    <p class="d-flex justify-content-between">
				    	<small class="text-muted">${propietario} / ${telefono}</small>
				    	<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
						  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						  <line x1="4" y1="7" x2="20" y2="7" />
						  <line x1="10" y1="11" x2="10" y2="17" />
						  <line x1="14" y1="11" x2="14" y2="17" />
						  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
						  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
						</svg>
				    </p>
				  </a>
			`;

			// Agregar las citas al HTML
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
	mascota: '',
	propietario: '',
	telefono: '',
	fecha: '',
	hora: '',
	sintomas: ''
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
	const { mascota, propietario, telefono, fecha, hora, sintomas } = citasobj;

	if ( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
		ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
		return;
	}

	// Crear id para la nueva cita
	citasobj.id = Date.now();

	// Le pasamos una copia del objeto por que de lo contrario se duplica la informacion
	administrarCitas.crear = { ...citasobj };

	// Reiniciar formulario y el objeto
	formulario.reset();
	reiniciarObjeto();

	// Mostrar las citas en el HTML
	ui.imprimirCitas( administrarCitas );
}

// Reiniciar el objeto
function reiniciarObjeto() {
	citasobj.mascota = '';
	citasobj.propietario = '';
	citasobj.telefono = '';
	citasobj.fecha = '';
	citasobj.hora = '';
	citasobj.sintomas = '';
}