import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Usecase, UsecaseOutput } from '../../base';

export class SignupUsecaseInput {
  @ApiProperty({
    description: 'Email address',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  password: string;
}

export class SignupUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'JWT Token',
    required: true,
  })
  jwt: string;
}

@Injectable()
export default class SignupUsecase extends Usecase<
  SignupUsecaseInput,
  SignupUsecaseOutput
> {
  async execute(input: SignupUsecaseInput): Promise<SignupUsecaseOutput> {
    const output = new SignupUsecaseOutput();

    return output;
  }
}
