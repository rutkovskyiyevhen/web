import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entity/users.entity";

@Entity()
export class Statistic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    matching_word: number;

    @Column({ default: 0 })
    translate_it: number;
    
    @Column({ default: 0 })
    wordByMeaning: number;

    @Column({ default: 0 })
    makeASentence: number;

    @OneToOne(() => User, (user) => user.statistic, { onDelete: 'CASCADE' })
    user: User;
}