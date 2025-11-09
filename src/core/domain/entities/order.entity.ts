/**
 * Order Entity - Domain Layer
 * Representa um pedido no sistema
 */
export class Order {
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly flavorIds: number[],
    public readonly additionalIds: number[],
    public readonly size: string,
    public readonly totalValue: number,
    public readonly paymentMethod: string,
    public readonly deliveryAddress: string,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: number;
    customerId: number;
    flavorIds: number[];
    additionalIds: number[];
    size: string;
    totalValue: number;
    paymentMethod: string;
    deliveryAddress: string;
    createdAt?: Date;
  }): Order {
    return new Order(
      props.id || 0,
      props.customerId,
      props.flavorIds,
      props.additionalIds,
      props.size,
      props.totalValue,
      props.paymentMethod,
      props.deliveryAddress,
      props.createdAt || new Date()
    );
  }

  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      flavorIds: this.flavorIds,
      additionalIds: this.additionalIds,
      size: this.size,
      totalValue: this.totalValue,
      paymentMethod: this.paymentMethod,
      deliveryAddress: this.deliveryAddress,
      createdAt: this.createdAt,
    };
  }
}
