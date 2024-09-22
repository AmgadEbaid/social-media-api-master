import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from './comments.entity';
import { CreateComment } from './comments.dto.ts/comment.create.dto';
import { users } from 'src/users/user.entity';
import { articles } from 'src/articles/models/articles.entity';
import { UpdateComment } from './comments.dto.ts/comment.update.dto';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(articles)
    private articleRepository: Repository<articles>,
  ) {}

  async createComment(user: users, createComment: CreateComment) {
    const { articleId, body } = createComment;

    const article = await this.articleRepository.findOneBy({
      id: articleId,
    });

    if (!article) {
      throw new NotFoundException('article not found');
    }

    const comment = this.commentsRepository.create({
      body: body,
      user: user,
      article: article,
    });

    return this.commentsRepository.save(comment);
  }

  async getComments(articlId: string) {
    return this.commentsRepository.find({
      relations:{user:true},
      where:{articleId:articlId},
      order:{created: 'DESC'},
    });
  }

  findOne(id: string) {
    return this.commentsRepository.findOneBy({ id: id });
  }
  async updateComment(Id: string, updatecomment: UpdateComment) {
    const comment = await this.commentsRepository.findOneBy({ id: Id });
    if (!comment) {
      throw new NotFoundException('comment was not found');
    }
    await this.commentsRepository.update(Id, {
      body: updatecomment.body,
    });

    return this.commentsRepository.findOneBy({ id: Id });
  }

  async deleteComment(Id: string) {
    const comment = await this.commentsRepository.findOneBy({ id: Id });
    if (!comment) {
      throw new NotFoundException('comment was not found');
    }
    return this.commentsRepository.delete(Id);
  }

  getCommentCount(articleId: string) {
    return this.commentsRepository.count({ where: { articleId: articleId } });
  }
}
