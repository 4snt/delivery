
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = 'http://localhost:3000'; // Assuming the app is running on port 3000

describe('API Integration Tests', () => {
  let cliente: any;
  let sabor: any;
  let adicional: any;

  beforeAll(async () => {
    // Create a client
    const clienteResponse = await request(app)
      .post('/api/clientes')
      .send({
        nome: 'Test Client',
        email: 'test@client.com',
        senha: 'password',
      });
    cliente = clienteResponse.body;

    // Create a sabor
    const saborResponse = await request(app)
      .post('/api/sabores')
      .send({
        nome: 'Test Sabor',
        imagem: 'test.jpg',
      });
    sabor = saborResponse.body;

    // Create an adicional
    const adicionalResponse = await request(app)
      .post('/api/adicionais')
      .send({
        nome: 'Test Adicional',
      });
    adicional = adicionalResponse.body;
  });

  afterAll(async () => {
    await prisma.pedido.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.sabor.deleteMany({});
    await prisma.adicional.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a new pedido', async () => {
    const response = await request(app)
      .post('/api/pedidos')
      .send({
        clienteId: cliente.id,
        sabores: [{ id: sabor.id }],
        adicionais: [{ id: adicional.id }],
        tamanho: 'Grande',
        valorTotal: 50.5,
        formaPagamento: 'Cartão de Crédito',
        enderecoEntrega: 'Rua Teste, 123',
      });

    expect(response.status).toBe(201);
    expect(response.body.clienteId).toBe(cliente.id);
  });

  it('should fetch all pedidos', async () => {
    const response = await request(app).get('/api/pedidos');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
