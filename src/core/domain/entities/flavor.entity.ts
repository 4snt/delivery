/**
 * Flavor Entity - Domain Layer
 * Representa um sabor de sorvete
 */
export class Flavor {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly image: string
  ) {}

  static create(props: {
    id?: number;
    name: string;
    image: string;
  }): Flavor {
    return new Flavor(
      props.id || 0,
      props.name,
      props.image
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
    };
  }
}
