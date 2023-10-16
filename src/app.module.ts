import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

const MONGO_URL: string = 'mongodb://localhost:27017/nest-pokemon';

@Module({
  imports: [PokemonModule, MongooseModule.forRoot(MONGO_URL), CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
