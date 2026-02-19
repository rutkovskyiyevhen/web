import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity()
export class Reset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({nullable: true})
    resetToken: string

    @OneToOne(() => User, (user) => user.reset, { onDelete: 'CASCADE' })
    user: User;
}