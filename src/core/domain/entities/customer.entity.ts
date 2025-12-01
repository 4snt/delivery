/**
 * Customer Entity - Domain Layer
 * Representa um cliente no sistema
 */
export class Customer {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly isAdmin: boolean,
    public readonly loyaltyPoints: number,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: number;
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
    loyaltyPoints?: number;
    createdAt?: Date;
  }): Customer {
    return new Customer(
      props.id || 0,
      props.name,
      props.email,
      props.password,
      props.isAdmin || false,
      props.loyaltyPoints ?? 0,
      props.createdAt || new Date()
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      loyaltyPoints: this.loyaltyPoints,
      createdAt: this.createdAt,
    };
  }
}
