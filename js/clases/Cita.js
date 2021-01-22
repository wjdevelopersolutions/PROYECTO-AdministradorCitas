/* =================================================================== //
	Cita
	Esta Clase crea las citas realizando el CRUD de las mismas.
	Create by wjdevelopersolutions on 20210122 1:09:00 pm
// =================================================================== */

class Cita {

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
		this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
	}

	eliminarCita(id) {
		this.citas = this.citas.filter(cita => cita.id.toString() !== id);
	}

}

export default Cita;
