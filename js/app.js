const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
        // Estos dos se van a llenar conforme el usuario vaya seleccionando algo
};

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => { // primero toma las criptomonedas y despues promise
    resolve(criptomonedas);
}); // se va a ejecutar unicamente en caso de que pueda resolver el promise


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas(); // Una vez que el documento esta listo, mandamos a llamar esta funcion

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

    // change - CUANDO YO SELECCIONES OTRA OPCION
});


async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // CODIGO CON FETCH 
    // fetch(url)
    //     .then(respuesta => respuesta.json()) // esta es la consulta a la API
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas));

    // CODIGO CON ASYNC Y AWAIT
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}


function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo; // Todo lo extraemos de aquí  cripto.CoinInfo

        // Crear las opciones, para escoger el tipo de criptomoneda que requiramos
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}


function leerValor(e) {
    // agregar el valor seleccionado al objeto  
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    // Validar
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Both fields are required');
        return; // cortamos la ejecutacion
    }

    // Consultar la API con los resultados
    consultarAPI();

}



function mostrarAlerta(msg) {
    const existeError = document.querySelector('.error');
    // si no hay un error previo agregalo
    if (!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        // Mensaje de error
        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }


}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    // CON FETCH

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]); // le pasamos a la API, los valores que el cliente solicita
    //     });


    // CON ASYNC Y AWAIT
    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]); // le pasamos a la API, los valores que el cliente solicita

    } catch (error) {
        console.log(error);
    }
}


function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `The price is: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Highest price of the day <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Lowest price of the day <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variation last 24 hours <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Last update <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}


function mostrarSpinner() {
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner'); // spinner viene de la pagina donde esta el spinner
    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}


// QUE ES UN END-POINT 
/* Un endpoint es una URL, estas las usas con fetch para poder obtener lo que necesitas.*/