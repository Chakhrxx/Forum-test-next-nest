import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  postId: string; // ID of the post this comment belongs to

  @IsNotEmpty()
  @IsString()
  userId: string; // ID of the user creating the comment
}
