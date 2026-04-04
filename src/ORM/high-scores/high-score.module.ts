import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighScoreEntity } from './high-score.entity';
import { HighScoreService } from './high-score.service';

@Module({
    imports: [TypeOrmModule.forFeature([HighScoreEntity])],
    providers: [HighScoreService],
    exports: [HighScoreService]
})
export class HighScoreModule { }