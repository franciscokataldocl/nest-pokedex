import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from './dto/pagination-pokemon.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;
  private defaultOffset: number;


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    
    this.defaultLimit = configService.get<number>('defaultLimit');
    this.defaultOffset = configService.get<number>('defaultOffset');
   }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  //OFFSET: DESDE DONDE EMPEZARA A MOSTRAR (indice registros)
  //LIMIT: CUANTOS MOSTRARA
  findAll(paginationDto: PaginationDto) {
    //si limit no viene es 10, si offset no viene es 0
    const {limit = this.defaultLimit , offset = this.defaultOffset} = paginationDto;
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      //ordernar la columna no de manera ascendente
      no: 1
    })
    .select('-__v') //eliminamos la columna __v de la respuesta (para limpiar)
  }

  async findOne(term: string) {
    let pokemon; //pokemon es de tipo ENTIDAD POKEMON

    //!isNaN(+no) SI "NO" ES UN NUMERO
    if (!isNaN(+term)) {
      //buscamos en la BBDD por la columna "NO"
      pokemon = await this.pokemonModel.findOne({ no: term });

    }

    //buscar por mongoid
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);

    }

    //buscar por nombre
    //si no hay pokemon en este punto pokemon seria igual a una clase
    //entonces si al convertir en string es undefined, signfica que no hay numero
    //ni mongoid por lo que nos quedaria buscar por nombre
    if (JSON.stringify(pokemon) === undefined) {
      let pokemonName = term.toLocaleLowerCase().trim();
      pokemon = await this.pokemonModel.findOne({ name: pokemonName });

    }



    if (!pokemon) throw new NotFoundException(`pokemon with no°${term} is not exist`)
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(term, updatePokemonDto, {
        new: true
      });
      return updatedPokemon
    } catch (error) {
      this.handleExceptions(error)
    }

    


  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = this.pokemonModel.findByIdAndDelete(id);
    const {acknowledged, deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    
    if(acknowledged && deletedCount === 0){
      throw new BadRequestException(`pokemon with id: ${id} not found`);
      return;
    }
    return {
      message: `pokemon with id: ${id} was delete successfully`,
      delete: true
    }

  }

  //error handlers
  private handleExceptions (error: any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in DB ${JSON.stringify(error.keyValue)}`)
    }
    throw new InternalServerErrorException(`Can't create pokemon. Check server logs`)
  }


}
