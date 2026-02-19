import { WordStatus } from "../../../common/enums/word-status.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { GameProgress } from "../../game/entities/game_progress.entity";
import { Language } from "../../languages/entity/lang.entity";


@Entity()
export class Word {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    word: string;

    @Column()
    translation: string;

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({ default: WordStatus.NOT_LEARNED })
    status: WordStatus;

    @ManyToOne(() => Language, (lang) => lang.words, { onDelete: 'CASCADE' })
    dictionary: Language;

    // @OneToMany(() => GameProgress, (gameProgress) => gameProgress.word, { cascade: true })
    // games: GameProgress;
}