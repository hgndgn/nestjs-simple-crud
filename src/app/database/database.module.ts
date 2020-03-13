import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '@config/config';

@Module({
  imports: [
    MongooseModule.forRoot(`${config.mongo.url}/${config.mongo.dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
})
export class DatabaseModule {}
