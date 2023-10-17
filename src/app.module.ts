import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

const MONGO_URL: string = 'mongodb://localhost:27017/nest-pokemon';

@Module({
  imports: [PokemonModule, MongooseModule.forRoot(MONGO_URL), CommonModule, SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
