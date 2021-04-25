const inquirer = require("inquirer");
require("colors");

const preguntas=[
    {
        type: "list",
        name: "opcion",
        message: "¿Qué deseas hacer?",
        choices: [
            {
                value: 1,
                name: `${"1.".green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${"2.".green} Historial`
            },
            {
                value: 0,
                name: `${"3.".green} Salir`
            }
        ]
    }
]




const inquirerMenu = async()=>{

    console.clear();
    console.log("=========================".green);
    console.log("Seleccione una opción".white);
    console.log("=========================\n".green);    

    const {opcion}= await inquirer.prompt(preguntas)

    return opcion;

}

const pausa =async()=>{

    const question=[
        {
            type: "input",
            name: "pausa",
            message: `Presione ${"ENTER".green} para continuar`
        }
    ]

    console.log("\n")

    const siguiente= await inquirer.prompt(question)

    return siguiente;
}

const leerInput= async(message)=>{
    
    const question=[
        {
            type: "input",
            name: "desc",
            message, //Con el validate obligamos a que se escriba un valor en cada pregunta
            validate(value){
                if(value.length===0){
                    return "Por favor, ingrese un valor"
                }
                return true;
            }
        }
    ]

    const {desc}= inquirer.prompt(question)  //solo nos interesa la desc del objeto que retorn el inquirer.prompt
       
    return desc;
    // Podemos retornar mediante desestructuracion el valor de un objeto
}

const listarLugares = async(lugares=[]) =>{

    const choices = lugares.map( (lugar, i) => {

        const idx = `${i + 1}.`.green; 

        return {
            value: lugar.id,  // el value es lo que nos van a regresar
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: "0",
        name: "0".green + "Cancelar"

    })

    const preguntas= [
        {
            type: "list",
            name: "id",
            message: "Seleccione el lugar: ",
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas) ;

    return id; 
}

const confirmar= async(message)=>{
    
    const preguntas= [
        {
            type: "confirm",
            name: "ok",
            message
        }
    ]

    const {ok} = await inquirer.prompt(preguntas) ;

    return ok
}

const mostrarListadoCheckList = async(tareas=[]) =>{

    const choices = tareas.map( (tarea, i) => {

        const idx = `${i + 1}.`.green; 

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn)? true: false
        }
    });

    const pregunta= [
        {
            type: "checkbox",
            name: "ids",
            message: "Selecciones",
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta) ;

    return ids; 
}




module.exports={
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}


