const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require("dotenv").config();

const main = async()=>{
    let opt = ""; //primero creamos un variable de opciones que tomara valor con el do-while

    const busquedas= new Busquedas();
    do {
        opt = await inquirerMenu()

        switch (opt) {
            case 1:
                //Mostrar el mensaje
                const termino= await leerInput("Ciudad: ");

                //buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id= await listarLugares(lugares);
                if(id==="0") continue;

                const lugarSel= lugares.find((l)=>l.id===id)

                busquedas.agregarHistorial(lugarSel.nombre)

                //Datos del clima
                const clima= await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                //Mostrar resultados
                console.log("\nInformación del lugar\n")
                console.log("Ciudad: ", lugarSel.nombre);
                console.log("Latitud: ", lugarSel.lat );
                console.log("Longitud: ", lugarSel.lng);
                console.log("Temperatura: ", clima.temp);
                console.log("Mínima: ",clima.min );
                console.log("Máxima: ", clima.max );
                console.log("Cómo está el clima: ", clima.desc);
            break;

            case 2:

                busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx = `${i + 1}.`.green; 
                    console.log(`${id}${lugar}`)
                })
            break;

            case 0: 
            break;
        } 

        await pausa();
        
        
    }while (opt !== 0); 
}

main()