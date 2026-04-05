import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HighScoreEntity } from './high-score.entity';

@Injectable()
export class HighScoreService {

    constructor(
        @InjectRepository(HighScoreEntity)
        private highScoreRepository: Repository<HighScoreEntity>
    ) { }

    public async updateHighScore(clientName: string, userAgent: string, difficulty: number): Promise<boolean> {
        const existing = await this.highScoreRepository.findOne({
            where: { clientName }
        });

        if (existing == null) {
            await this.highScoreRepository.save({ clientName, userAgent, bestDifficulty: difficulty });
            return true;
        } else if (difficulty > existing.bestDifficulty) {
            await this.highScoreRepository.update({ clientName }, { bestDifficulty: difficulty, userAgent });
            return true;
        }
        return false;
    }

    public async checkDeviceHighScore(userAgent: string, difficulty: number): Promise<boolean> {
        const result = await this.highScoreRepository
            .createQueryBuilder('hs')
            .select('MAX(hs.bestDifficulty)', 'bestDifficulty')
            .where('hs.userAgent = :userAgent', { userAgent })
            .getRawOne();

        const currentBest = result?.bestDifficulty ?? 0;
        return difficulty > currentBest;
    }

    public async getTopScores(limit: number = 20) {
        return await this.highScoreRepository.find({
            select: {
                clientName: true,
                userAgent: true,
                bestDifficulty: true,
                updatedAt: true
            },
            order: { bestDifficulty: 'DESC' },
            take: limit
        });
    }

    public async getTopScoresByDevice(limit: number = 40) {
        return await this.highScoreRepository
            .createQueryBuilder('hs')
            .select('hs.userAgent', 'userAgent')
            .addSelect('MAX(hs.bestDifficulty)', 'bestDifficulty')
            .groupBy('hs.userAgent')
            .orderBy('MAX(hs.bestDifficulty)', 'DESC')
            .limit(limit)
            .getRawMany();
    }
}