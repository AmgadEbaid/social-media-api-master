import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { articles } from './models/articles.entity';
import { ILike, QueryResult, Repository } from 'typeorm';
import { users } from 'src/users/user.entity';
import { UpDateArticle } from './articles.dto/update-article.dto';
import { SerchQuery } from './articles.dto/article.search.dto';
import { tuple } from 'zod';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(articles) private articleRepository: Repository<articles>,
  ) {}

  createArticle(
    user: users,
    titile: string,
    slug: string,
    content: string,
    description: string,
  ) {
    const article = new articles();
    (article.titile = titile),
      (article.slug = slug),
      (article.content = content),
      (article.user = user);
    article.description = description;
    return this.articleRepository.save(article);
  }

  async deleteArticle(id: string) {
    const article = await this.articleRepository.findOneBy({ id: id });
    if (!article) {
      throw new NotFoundException('article not found');
    }
    this.articleRepository.softDelete({ id: id });
  }

  async updateArticle(Id: string, updateArticle: UpDateArticle) {
    await this.articleRepository.update(Id, {
      titile: updateArticle.titile,
      slug: updateArticle.slug,
      content: updateArticle.content,
    });

    return this.articleRepository.findBy({ id: Id });
  }

  getall(skip: number, take: number) {
    return this.articleRepository.find({
      relations: { user: true },
      select: {
        description: true,
        titile: true,
        favoriteCount: true,
        id: true,
        created: true,
        updated: true,
        user: { id: true, diplayname: true, email: true },
      },
      order: { created: 'DESC', updated: 'DESC' },

      take: take,
      skip: skip,
    });
  }

  getUserArticles(userId:string){
    return this.articleRepository.find({
      relations:{user:true},
      where:{user:{id:userId}},
   
      order:{created:"DESC",updated:'DESC'}
    })
  }

  getById(Id: string) {
    return this.articleRepository.findOne({
      relations: { user: true },
      select: {
        content: true,
        description: true,
        titile: true,
        favoriteCount: true,
        id: true,
        created: true,
        updated: true,
        user: { id: true, diplayname: true, email: true },
      },
      where: { id: Id },
    });
  }


  searchArticle(serchQuery: SerchQuery) {
    const { query, take, skip, order } = serchQuery;
    console.log(query,take,skip)
    return this.articleRepository.find({
      relations: { user: true },
      select: {
        description: true,
        titile: true,
        favoriteCount: true,
        id: true,
        created: true,
        updated: true,
        user: { id: true, diplayname: true, email: true },
      },
      take: take,
      skip: skip,
      where: [
        { titile: ILike(`%${query}%`) },
        { content: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
        { user: { diplayname: ILike(`%${query}%`) } },
        { user: { email: ILike(`%${query}%`) } },
      ],
       
      order: { created: 'DESC', updated: 'DESC' },
    });
  }

  async addFavorites(user: users, articleId:string) {
    const article = await this.articleRepository.findOneBy({ id: articleId });
    if (!article) {
      throw new NotFoundException('article was not found');
    }

    const userLiked = await this.articleRepository
      .createQueryBuilder()
      .innerJoinAndSelect('articles.favoreteUsers', 'users')
      .where('articles.Id = :id', { id: articleId })
      .andWhere('users.id =:userid', { userid: user.id })
      .getOne();

    if (userLiked) {
      return { msg: 'user is already liked this article' };
    }

    await this.articleRepository
      .createQueryBuilder()
      .relation(articles, 'favoreteUsers')
      .of(articleId)
      .add(user);

    await this.articleRepository.increment(
      { id: articleId },
      'favoriteCount',
      1,
    );
  }

  async deleteFavorites(user: users, articleId: articles['id']) {
    const userLiked = await this.articleRepository
      .createQueryBuilder()
      .innerJoinAndSelect('articles.favoreteUsers', 'users')
      .where('articles.Id = :id', { id: articleId })
      .andWhere('users.id =:userid', { userid: user.id })
      .getOne();
      

    if (!userLiked) {
      throw new NotFoundException('user does not like this article');
    }

    await this.articleRepository
      .createQueryBuilder()
      .relation(articles, 'favoreteUsers')
      .of(articleId)
      .remove(user);

    await this.articleRepository.decrement(
      { id: articleId },
      'favoriteCount',
      1,
    );
  }

  getUserFavorites(user: users) {
    return this.articleRepository
      .createQueryBuilder()
      .leftJoinAndSelect('articles.favoreteUsers', 'users')
      .where('users.id =:userid', { userid: user.id })
      .getManyAndCount();
  }

  async getIsFavorite(user: users, articleId: string) {
    const userLiked = await this.articleRepository
    .createQueryBuilder()
    .innerJoinAndSelect('articles.favoreteUsers', 'users')
    .where('articles.Id = :id', { id: articleId })
    .andWhere('users.id =:userid', { userid: user.id })
    .getOne();

          return userLiked ? true : false
  }
}


