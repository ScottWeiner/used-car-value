import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Make } from './make.entity';

@Entity()
export class Model {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string
    @ManyToOne(() => Make, (make) => make.models)
    make: Make


}