import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reset } from "./reset.entity";
import { Roles } from "../../../common/enums/role.enum";
import { Statistic } from "../../statistic/entity/statistic.entity";
import { Language } from "../../languages/entity/lang.entity";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({nullable: true})
    userName: string;

    @Column({nullable: true})
    password: string | null;

    @Column({ nullable: true, unique: true })
    googleId: string | null;

    @Column({default: Roles.USER})
    role: Roles

    @Column({nullable: true})
    nativeLang: string;

    @OneToMany(() => Language, (lang) => lang.user, { cascade: true })
    learningLangs: Language[];

    // @OneToMany(() => Game, (game) => game.user, { cascade: true })
    // games: Game[];

    // @OneToMany(() => Support, (support) => support.user)
    // feedback: Support[];

    @OneToOne(() => Reset, (reset) => reset.user, { cascade: true })
    @JoinColumn()
    reset: Reset;

    @OneToOne(() => Statistic, (statistic) => statistic.user, { cascade: true })
    @JoinColumn()
    statistic: Statistic;
}