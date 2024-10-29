// src/post/dto/create-post.dto.ts
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Community } from '../entities/post.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Community)
  community: Community;

  @IsNotEmpty()
  userId: string; // Assuming you will pass the user ID of the creator
}
