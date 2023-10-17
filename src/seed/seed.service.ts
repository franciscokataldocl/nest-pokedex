import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { Axios, AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }
 
  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');
   let pokemonToInsert: {name: string, no: number}[] = [];
    data.results.map(({name, url})=>{
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2])
      // console.log({name, no})
      const pokemon = {
        name,
        no
      }
      pokemonToInsert.push(pokemon);

    })

     try {
       await this.pokemonModel.insertMany(pokemonToInsert);
      } catch (error) {
        this.handleExceptions(error)
      }
    return 'seed executed';
  }


   //error handlers
   private handleExceptions (error: any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in DB ${JSON.stringify(error.keyValue)}`)
    }
    throw new InternalServerErrorException(`Can't create pokemon. Check server logs`)
  }
 
}
