import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { throwError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name) // Integracion de NEST, para inyectar modelos en nuestro servicio
    private readonly PokemonModel: Model<Pokemon>,

    private readonly configService : ConfigService,
  ){
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name=createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.PokemonModel.create( createPokemonDto );
      return pokemon;  
    } catch (error) {
      this.handleExceptions(error);
    }

    
  }

  findAll(paginationDto: PaginationDto) {
    const { limit=this.defaultLimit, offset=0 } = paginationDto;
    return this.PokemonModel.find()
            .limit(limit) // Tomo el limite que me envian por parametro
            .skip(offset) // Tomo el offset que me envian por parametro
            .sort({
              no: 1 // Ordeno ascendente por numero ( campo no)
            })
            .select('-__v')// Defino los campos a devolver , el menos - indica que es no se mostrará
  }

  async findOne(termino_busqueda: string) {

    let pokemon: Pokemon; // Indica que la variable pokemon que creo, es de tipo de mi entity

    // Numero
    if(!isNaN(+termino_busqueda)){
      pokemon = await this.PokemonModel.findOne({
        no: termino_busqueda
      })
    }
    // ID Mongo
    if( !pokemon && isValidObjectId(termino_busqueda)){
      pokemon = await this.PokemonModel.findById(termino_busqueda)
    }

    // por Nombre
    if(!pokemon){
      pokemon = await this.PokemonModel.findOne({
        name: termino_busqueda.toLowerCase().trim()
      })
    }

    if(!pokemon) throw new NotFoundException(`Pokemon de ID o Nombre ${termino_busqueda} No se encontró`)
    return pokemon;
  }

  async update(termino_busqueda: string, updatePokemonDto: UpdatePokemonDto) {

    const Pokemon = await this.findOne(termino_busqueda);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      const pokemon = await Pokemon.updateOne(updatePokemonDto,{new : true}) // Retorna el nuevo objeto despues de la actualizacion
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
   
  }

  async remove(id: string) {
    /*const pokemon = await this.findOne(id);
    await pokemon.deleteOne();*/ // Encontrar y eliminar por cualqueier cosa que ingrese por ID

    // const result = await this.PokemonModel.findByIdAndDelete( id ); // Elimina, pero sino encuentra el mongoid en la base de datos igual retorna status 200

    const {deletedCount} = await this.PokemonModel.deleteOne({ _id : id }); // desestructuro la respuesta del delte one

    if(deletedCount===0)
      throw new BadRequestException(`Pokemon con id ${ id } no se encuentra en la base`)

    return;
  }

  private handleExceptions( error:any ){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon ya existe en BDD ${JSON.stringify(error.keyValue)}`)
    }
    throw new InternalServerErrorException('No se puede actualizar  el pokemon');

  }
}
