import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig]
    }),
    PokemonModule,
    MongooseModule.forRoot(process.env.MONGODB),
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor() {
  //   console.log(process.env)
  // }
}
