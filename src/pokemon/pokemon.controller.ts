import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto)
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':termino_busqueda')
  findOne(@Param('termino_busqueda') termino_busqueda: string) {
    return this.pokemonService.findOne(termino_busqueda);
  }

  @Patch(':termino_busqueda')
  update(@Param('termino_busqueda') termino_busqueda: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    
    return this.pokemonService.update(termino_busqueda, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
