require('dotenv').config()

const { leerInput, inquiererMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;


    do {
    //opcion que invoca el menu del inquirer
        opt = await inquiererMenu();

    //control de las opciones de la consola mediante switch
        switch (opt) {
            case 1:
                //mostrar mensaje
                const eleccionLugar = await leerInput('Lugar que deseas buscar?');
               

                //buscar los lugares
                const lugares = await busquedas.ciudad(eleccionLugar);
                

                //seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                //cancelar al usar el id 0 de cancelar
                if(idSeleccionado === '0') continue; //

                const lugarSel = lugares.find( l => l.id === idSeleccionado)
                //si el id es dif de 0 GUARDAR EN BD 
                //todo esto es sincrono por eso no se usa el await
                busquedas.agregarHistorial(lugarSel.nombre)

                //datos del clima relacionados al lugar
                const clima = await busquedas.climaDeLugar(lugarSel.lat, lugarSel.lon);
                //console.log(clima);


                //mostrar resultados
                console.clear();
                console.log('\nInfomacion del lugar\n'.bgGreen);
                console.log('Ciudad:', lugarSel.nombre );
                console.log('latitud:', lugarSel.lat);
                console.log('longitud:', lugarSel.lon);
                console.log('temperatura:', clima.temperatura);
                console.log('Minima:', clima.tempMin);
                console.log('Maxima:', clima.tempMax);
                console.log('Como esta el clima?:', clima.desc);

                break;
            //persistencia de la informacion que se busco (historial)
                case 2:
                    busquedas.historialCapitalizado.forEach( (lugar, i) => {
                        const idx = `${i + 1}.`.green;
                        console.log( `${idx} ${lugar}` );
                    })

                break;

        }

        if (opt !== 0) await pausa();
        
     } while (opt !== 0);


}

main()