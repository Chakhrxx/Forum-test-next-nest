// src/post/entities/post.entity.ts
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum Community {
  History = 'History',
  Food = 'Food',
  Pets = 'Pets',
  Health = 'Health',
  Fashion = 'Fashion',
  Exercise = 'Exercise',
  Others = 'Others',
}

@Entity()
@Unique(['id'])
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column({
    type: 'enum',
    enum: Community,
  })
  @IsNotEmpty()
  community: Community;

  // Many-to-one relationship with User
  @ManyToOne(() => User, (user) => user.posts) // Consider using lazy loading for performance
  @IsNotEmpty()
  users: User; // The user who created the post

  @OneToMany(() => Comment, (comment) => comment.posts, { cascade: true }) // Comments related to this post
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated' })
  updated: Date;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}
