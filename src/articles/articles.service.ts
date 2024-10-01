import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
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
        user: { id: true, diplayname: true, email: true, image: true },
      },
      order: { created: 'DESC', updated: 'DESC' },

      take: take,
      skip: skip,
    });
  }

  getUserArticles(userId: string) {
    return this.articleRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },

      order: { created: 'DESC', updated: 'DESC' },
    });
  }

  async getById(Id: string) {
    const article = await this.articleRepository.findOne({
      relations: { user: true },
      select: {
        content: true,
        description: true,
        titile: true,
        favoriteCount: true,
        id: true,
        created: true,
        updated: true,
        user: { id: true, diplayname: true, email: true, image: true },
      },
      where: { id: Id },
    });
    return article;
  }

  searchArticle(serchQuery: SerchQuery) {
    const { query, take, skip, order } = serchQuery;
    console.log(query, take, skip);
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

  async addFavorites(user: users, articleId: string) {
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

 async getUserFavorites(userId: string) {

    const UserFavoriteArticles  = await this.articleRepository.find({relations:{user:true,favoreteUsers:true},
    where:[{favoreteUsers:{id:userId}}]
    })
    return UserFavoriteArticles
  }

  async getIsFavorite(user: users, articleId: string) {
    const fav = await this.articleRepository.find({
      relations: { favoreteUsers: true ,user:true},
      where:[{ id: articleId },{ favoreteUsers: { id: user.id }}],
    });
    console.log(user.id,articleId)
    console.log(fav );
    const userLiked = await this.articleRepository
      .createQueryBuilder()
      .innerJoinAndSelect('articles.favoreteUsers', 'users')
      .where('articles.Id = :id', { id: articleId })
      .andWhere('users.id =:userid', { userid: user.id })
      .getOne();

    return userLiked ? true : false;
  }

 
}
