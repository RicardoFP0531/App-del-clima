const inquirer = require('inquirer');
require('colors');

//CREANDO TODAS LAS PREGUNTAS DEL MENU CON INQUIRER

const preguntas = [{

    type: 'list',
    name: 'opcion',
    message: 'Que desea hacer ?',
    //choices: ['opt1', 'opt2','opt3']
    //MODIFICACION DE OPCIONES MANDADAS COMO ARREGLO DE OBJETOS
    choices: [
        {
            value: 1,
            name: `${'1.'.green} Buscar Ciudad`,

        },

        {
            value: 2,
            name: `${'2.'.green} Historial de ciudades`,

        },
        {
            value: 0,
            name: `${'0.'.green} Salir de la aplicación`,

        },
       
    ]
}];



const inquiererMenu = async() => {

    console.clear();
    console.log('==========================='.bold.white);
    console.log('   Seleccione una ciudad:  '.bgYellow.black);
    console.log('===========================\n'.bold.white);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;

}

//funcion para esperar y mostrar el enter para continuar de video 50 curso
const pausa = async() => {

    const esperar = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];

    console.log('\n')
    await inquirer.prompt(esperar);

}

const leerInput = async(message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
  //ecmaScript 6 nombnar propiedades igual que su valor es redundante
            message,
  //forzar a que la persona siempre ingrese un valor, siempre tendran que poner un valor
            validate(value ) {
                if(value.length === 0) {
                    return 'Debe ingresar un valor'.bgRed
                } 
                return true;
            }
        }
    ];
  // inquirer.prompt(question) regresa un objeto al cual solo queremos la descripcion
  //por eso desestructuramos el desc
    const {desc} = await inquirer.prompt(question)
    return desc;
}


const listarLugares = async( lugares = []) => {
    console.log('')
    const choices = lugares.map( (lugar, i) => {

        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`,

        }
    });

    choices.unshift({
        value: '0',
        name:  '0.'.green + ' Cancelar'
    })

    const preguntas = [{

        type: 'list',
        name: 'id',
        message: 'Seleccione el lugar que buscar',
        choices
    }]

    const {id} = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async(message) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const {ok} = await inquirer.prompt(question);
    return ok;

}


const mostrarListadoCheckList = async(tareas = []) => {
    console.log('')
    
    const choices = tareas.map( (tarea, i) => {

        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    const pregunta = [{

        type: 'checkbox',
        name: 'ids',
        message: 'Seleccione',
        choices
    }]

    const {ids} = await inquirer.prompt(pregunta);
    return ids;
}



module.exports = {
    inquiererMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}