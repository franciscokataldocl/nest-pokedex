import { Injectable } from '@nestjs/common';
import axios, { Axios, AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;
 
  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');
    data.results.map( ({name, url})=>{
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2])
      console.log({name, no})
    })
    return data.results;
  }

 
}
