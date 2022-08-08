import { ValueObject } from './base';
import { z } from 'zod';

const mailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mailSchema = z.string().regex(mailRegex);
type MailType = z.infer<typeof mailSchema>;

export class EmailVO extends ValueObject {
  constructor(input: MailType) {
    super();

    
  }
}
