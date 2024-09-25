import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { articles } from 'src/articles/models/articles.entity';
import { Comments } from 'src/comments/comments.entity';

@Entity()
export class users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  diplayname: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable:true , default:"https://miro.medium.com/v2/resize:fill:64:64/1*dmbNkD5D-u45r44go_cf0g.png"})
  image: string;
  @Exclude()
  @Column({ nullable: true })
  password: string;
  @Column({ default: false })
  IsAdmin: boolean;
  @Exclude()
  @OneToMany(() => articles, (articles) => articles.user)
  articles: articles[];
  @Exclude()
  @OneToMany(() => Comments, (Comments) => Comments.user)
  comments: Comments[];
  @ManyToMany(() => articles, (articles) => articles.favoreteUsers)
  favoriteArticle: articles[];
}
