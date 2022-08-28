export abstract class UsecaseInput {}
export abstract class UsecaseOutput {}

export abstract class Usecase<
  Input extends UsecaseInput,
  Output extends UsecaseOutput,
> {
  abstract execute(
    input: Input | Input[],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    options: unknown = {},
  ):
    | Output
    | Output[]
    | Promise<Output>
    | Promise<Output[]>
    | void
    | Promise<void>;
}
