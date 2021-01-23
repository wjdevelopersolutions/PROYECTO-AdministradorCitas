import { datosCita, nuevaCita, empezarCitaFunc } from '../funciones.js';
import {
	mascotaInput,
	propietarioInput,
  tipoInput,
	telefonoInput,
	fechaInput,
	horaInput,
	sintomasInput,
	formulario,
  empezarCita
} from '../selectores.js';

class App {

  constructor() {
    this.initApp();
  }

  initApp() {
    mascotaInput.addEventListener('change', datosCita);
  	tipoInput.addEventListener('change', datosCita);
  	propietarioInput.addEventListener('change', datosCita);
  	telefonoInput.addEventListener('change', datosCita);
  	fechaInput.addEventListener('change', datosCita);
  	horaInput.addEventListener('change', datosCita);
  	sintomasInput.addEventListener('change', datosCita);

    // FORMULARIO PARA NUEVA CITAS
    formulario.addEventListener('submit', nuevaCita);

    empezarCita.addEventListener('click', empezarCitaFunc)

  }
}

export default App;
