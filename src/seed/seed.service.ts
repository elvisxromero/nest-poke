import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
@Injectable()
export class SeedService {



  constructor(
    @InjectModel(Pokemon.name) // Integracion de NEST, para inyectar modelos en nuestro servicio
    private readonly PokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter // Patron adaptador de Axios
  ){}
  
  // Insertando 1 a 1 con create
  // async executeSeed() {
  //   const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10'); //  Con axios directamente
  //   const {data} = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10'); // Cuando modifico y creo un nuevo provider para que sea el que ejecuta la accion

  //   data.results.forEach(async ({name,url}) =>{

      

  //     const segments = url.split('/');
  //     const no:number = +segments[segments.length - 2];// me traigo el penultimo indice del arreglo que deberia ser el numero delpokemon

  //     const pokemon = await this.PokemonModel.create( {name,no} );
  //   })
  //   return 'seed ejecutado';
  // }


  // Insertando un array con promesas, de manera simultanea
  // async executeSeed() {
  //   await this.PokemonModel.deleteMany({});//  PAra eliminar la tabla antes de cargar los datos
  //   const {data} = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

  //   const insertPromisesArray = [];
  //   data.results.forEach(async ({name,url}) =>{

  //     const segments = url.split('/');
  //     const no:number = +segments[segments.length - 2];// me traigo el penultimo indice del arreglo que deberia ser el numero delpokemon

  //     insertPromisesArray.push(
  //       this.PokemonModel.create({name,no})
  //     );
  //   })
    
  //   await Promise.all( insertPromisesArray ); // Espera a que cada registro se ejecute de una vez, pero con create dentro de cada uno
  //   return 'seed ejecutado';
  // }

  
  // Insertando un array con promesas, de manera simultanea
  async executeSeed() {
    await this.PokemonModel.deleteMany({});//  PAra eliminar la tabla antes de cargar los datos
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000');

    const pokemonInsert: {name:string, no:number}[] = [];
    
    data.results.forEach(async ({name,url}) =>{

      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];// me traigo el penultimo indice del arreglo que deberia ser el numero delpokemon

      pokemonInsert.push({name,no});
    })
    
    await this.PokemonModel.insertMany(pokemonInsert);// Solo una insert masivo ( tipo copy)
    return 'seed ejecutado';
  }

}
