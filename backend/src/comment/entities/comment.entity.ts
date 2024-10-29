// src/comment/entities/comment.entity.ts
import { IsNotEmpty } from 'class-validator';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  message: string;

  // Many-to-one relationship with Post
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  posts: Post; // The post this comment belongs to

  // Many-to-one relationship with User
  @ManyToOne(() => User, (user) => user.comments)
  users: User; // The user who created the comment

  @CreateDateColumn({ type: 'timestamptz' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated: Date;
}

export interface PaginatedComments {
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
}
