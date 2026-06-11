import {Category} from './category';

export class Course {
  public id!: number;
  public name = '';
  public description = '';   
  public courseLength = '';
  public creation_date = '';
  public creatorId!: string;
  public creatorUsername!: string;
  public category = new Category();
}