/* =================================================================== //
	UI
	Esta Clase imprime en el DOM las citas y sus actulaizaciones.
	Create by wjdevelopersolutions on 20210122 1:09:00 pm
// =================================================================== */
import { itemCitaAction } from '../funciones.js';
import { contenedorCitas } from '../selectores.js';

import { jumbotron } from '../selectores.js';

// IndexDB
import { DB } from '../funciones.js';

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

	// TODO: Impimir cita
	imprimirCitas(  ) {

		// Limpiar citas
		this.limpiarHTML();

		// Leer el contenido desde la base de datos
		const objectStore = DB.transaction('citas').objectStore('citas');

		const total = objectStore.count();
		total.onsuccess = () => {
			this.mostrarNoData(total.result);
		}

		objectStore.openCursor().onsuccess = function(event) {

			const cursor = event.target.result;

			if ( cursor ) {
				// EXTRAYENDO LAS VARIABLES DEL OBJETO CITA
				const { mascota, tipo, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;

				// CREANDO EL <li>
				const li = document.createElement('li');
				li.classList.add('cita', 'list-group');

				// CREANDO EL <a>
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

				// AGREGANDO EL A AL LI
				li.appendChild(a);

				// AGREGAR LA CITA AL HTML
				contenedorCitas.appendChild(li);

				// IndexDB cursor VE AL SIGUIENTE ELEMENTO
				cursor.continue();
			}

		}
	}

	mostrarNoData( resultado ) {
		if ( resultado > 0 ) {
			jumbotron.classList.remove('animate__animated', 'animate__fadeIn', 'animate__faster');
			jumbotron.style.display = "none";
		} else {
			jumbotron.style.display = "block";
			jumbotron.classList.add('animate__animated', 'animate__fadeIn', 'animate__faster');
		}
	}

	limpiarHTML() {
		while( contenedorCitas.firstChild ) {
			contenedorCitas.removeChild(contenedorCitas.firstChild);
		}
	}

}

export default UI;
