import { plainToClass, ClassConstructor } from '@nestjs/class-transformer';

export abstract class BaseFactory {
  protected createEntity<E, P>(entity: ClassConstructor<E>, plain: P): E {
    return plainToClass(entity, plain, {
      excludeExtraneousValues: true,
    }) as E;
  }

  protected createEntityArray<E, P>(
    entity: ClassConstructor<E>,
    plains: P[],
  ): E[] {
    return plainToClass(entity, plains, { excludeExtraneousValues: true });
  }
}
