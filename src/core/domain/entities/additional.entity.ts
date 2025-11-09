/**
 * Additional Entity - Domain Layer
 * Representa um adicional para pedidos
 */
export class Additional {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {}

  static create(props: {
    id?: number;
    name: string;
  }): Additional {
    return new Additional(
      props.id || 0,
      props.name
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
