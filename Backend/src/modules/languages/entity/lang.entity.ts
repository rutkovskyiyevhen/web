import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entity/users.entity";
import { Word } from "../../word/entity/words.entity";


@Entity()
export class Language{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 1})
    priority: number;

    @Column()
    learningLang: string;

    @Column({default: 0})
    qtyNotLearnedWord: number;

    @Column({ default: 0 })
    qtyLearnedWord: number;

    @Column({ default: 0 })
    qtyInProgress: number;

    @ManyToOne(() => User, (user) => user.learningLangs, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Word, (word) => word.dictionary, { cascade: true })
    words: Word[];
}