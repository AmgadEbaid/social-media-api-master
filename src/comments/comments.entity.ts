import { articles } from 'src/articles/models/articles.entity';
import { users } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

import { Exclude, Transform } from 'class-transformer';

@Entity({ name: 'comments' })
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column()
  userId: string;

  @Column()
  articleId: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => users, (users) => users.comments)
  user: users;
  @Exclude()
  @ManyToOne(() => articles, (articles) => articles.comments, {})
  article: articles;
}
