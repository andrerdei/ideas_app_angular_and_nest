import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  private get token() {
    const {id, username} = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      {expiresIn: '7d'},
    );
  }

  @BeforeInsert()
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public toResponseObject(showToken = true) {
    const {id, created, username, token} = this;
    const responseObject = {
      id,
      created,
      username,
      token,
    };

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  public async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
