const fs = require('fs');

const axios = require('axios');

class Busquedas {

    //arreglo de los lugares buscados inicializado vacio
    historial = [];
    //path en donde se guarda la informacion
    dbPath = './db/database.json';

    constructor() {
        //TODO: leer la bd si existe
        this.leerDb();
    }

    //getter para capitalizar los lugares buscados
    get historialCapitalizado() {
        //hacer un return del historial 
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }

    //getter para traer los parametros de mapbox
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }

    }
    //getter para traer los parametros de openweather 
    get paramOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

  //primer metodo para buscar una ciudad sera un metodo async por que se hara una peticion http
    async ciudad (lugar = '') {

        try {
            //peticion http usando axios para la API de mapbox
            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const response = await instancia.get();            
            return response.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lon: lugar.center[0],
                lat: lugar.center[1],

            }) )


            
    
        } catch (error) {
            console.log('No se encontro nada')
            return [];
            
        }
   
    }

    async climaDeLugar (lat, lon) {

        try {
            //peticion get http usando axios para la API openwheather
            const instancia =  axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramOpenWeather, lat, lon}
            });
            //respuesta de la data
            const respuesta = await instancia.get();
            const {weather, main} = respuesta.data;

            return {
                desc: weather[0].description,
                tempMin: main.temp_min,
                tempMax: main.temp_max,
                temperatura: main.temp,

            }

            
        } catch (error) {
            console.log('No existen climas para esta ubicacion')
        }


    }

    //metodo encargado para grabar el historial
    agregarHistorial ( lugar = '' ) {
        //validacion de existencia en caso de buscar el mismo lugar mas de una vez

        if(this.historial.includes(lugar.toLocaleLowerCase())) { 
            return;
        }
        //condicion para limitar el historial en este caso admite 10 lugares 
        this.historial = this.historial.splice(0,9)

        //metodo que empuja el lugar buscado al arreglo o historial
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en archivo de texto
        this.guardarDb();


    }

    //metodo para guardar DB
    guardarDb() {
        //si tuviesemos mas propiedades que guardar o grabar
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }



    //metodo para leer la BD
    leerDb() {

        if(!fs.existsSync(this.dbPath)) {
            return null;
        }

        const info = fs.readFileSync(this.dbPath, 'utf8');
        const dataParse = JSON.parse(info);

        this.historial = dataParse.historial
    }

}

module.exports = Busquedas;