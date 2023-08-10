import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  thumbnail: string;

  status: number;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  category: Category;
}
