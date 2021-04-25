const fs = require("fs")
const axios = require('axios');

class Busquedas{

    historial=[];
    dbPath= "./db/database.json"

    constructor(){
        this.leerDB(); //tenemos que llamar la funcion de leerDB debajo del constructor
    }

    get historialCapitalizado(){

        return this.historial.map((lugar)=>{
            const palabra= lugar.split(" ");
            palabra.map((p)=>{
                p[0].toUpperCase() + p.substring(1)
            })
            
            return palabra.join(" ")
        })

    }

    get paramsMapBox(){
        return {
            "access_token": process.env.MAPBOX_KEY,
            "limit": 5,
            "language": "es"
        }
    }

    get paramsGeo(){   //values always under strings
        return{
            "access_token": process.env.OPENWEATHER_KEY,
            "units": "metrics",
            "language": "es"
        }
    }

    //creamos el primer método para buscar una ciudad o un lugar

    async ciudad(lugar=""){
       try{
        //peticion http
            const instance= axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })

            const resp= await instance.get();
            return resp.data.features.map((lugar)({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })); //vamos a retornar la info que queremos en un objeto

       }catch(error){
            return[];
       }
    }
    
    async climaLugar (lat, lon){
        try {

            const instance= axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsGeo, lat, lon}

            })

            const resp = await instance.get();
            const {weather, main}=resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        }catch (error) {
            console.log(error)
            return[]
        }
    }

    agregarHistorial(lugar=""){

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
         
        this.historial= this.historial.splice(0,5) //con el splice queremos limitar el número de elementos en el arreglo
        
        this.historial.unshift(lugar);
        

        this.guardarDB(); //llamamos la funcion donde queramos guardar 
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }

    leerDB(){

        //debe existir
        if(!fs.existsSync(this.dbPath)){   //hay que poner "this." en las instancias declaradas en la clase
            return;
        };

        const info= fs.readFileSync(archivo, {encoded: "utf-8"});
        const data = JSON.parse(info);
        this.historial= data.historial;
    }

}


module.exports= Busquedas;



//las clases de objetos no tienen arguemntos pero los constructores si. constructor(){}
//Las clases se exportan sin necesidad de objetos
//Antes del constructor definimos neustras propiedades
//Ponemos "async " en los métodos de las clases porque vamos a realizar una peticion http
//las funciones de los métodos de una clase son de forma tradicional
//con axios obtenemos la respuesta de la peticion http como un objeto
//cuando hagamos una peticion hacia un endpoint e snecesario que lo pongamos como un try y un catch
// Tenemos que hacer "axios.create({})" en un obejto dentro para crear la instancias del API
//Dentro del objeto de axios.create crearemos un baseURL y un params, el params será un objeto
//Las Keys de los params se expresan como strings 
//Usaremos un getter que lo que hara es que para todos los arrays definir los prams del endpoint 
    //get paramMapBoc(){ return {params}}

//El tolowercase() va asignado dentro del argumento del includes().
//Para guardar y leer en base de datos vamos a clrear una nueva instancia en nuestra clase con el filePath