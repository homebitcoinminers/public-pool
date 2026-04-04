import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TrackedEntity } from '../utils/TrackedEntity.entity';

@Entity()
export class HighScoreEntity extends TrackedEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 64, type: 'varchar' })
    clientName: string;

    @Column({ length: 64, type: 'varchar' })
    userAgent: string;

    @Column({ type: 'float', default: 0 })
    bestDifficulty: number;

}