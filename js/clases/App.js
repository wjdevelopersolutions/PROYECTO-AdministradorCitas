import { datosCita, nuevaCita } from '../funciones.js';
import {
	mascotaInput,
	propietarioInput,
  tipoInput,
	telefonoInput,
	fechaInput,
	horaInput,
	sintomasInput,
	formulario
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

  }
}

export default App;
