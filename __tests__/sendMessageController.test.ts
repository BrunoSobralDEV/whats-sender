// tests/sendMessageController.test.ts
import { sendMessageController } from '../src/controllers/whatsapp.controller';
import { messageQueue } from '../src/services/messageQueue';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../src/utils/AppError';

// Mocka o Bull para não enfileirar mensagens reais durante os testes
jest.mock('../src/services/messageQueue', () => ({
  messageQueue: {
    add: jest.fn(),
  },
}));

describe('sendMessageController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve retornar erro 400 se o telefone ou a mensagem não forem fornecidos', async () => {
    req.body = {}; // Nenhum telefone ou mensagem
    await sendMessageController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Phone and message are required' });
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('deve enfileirar a mensagem com sucesso', async () => {
    req.body = { phone: '+5571987654321', message: 'Olá, mundo!' };
    await sendMessageController(req as Request, res as Response, next);

    expect(messageQueue.add).toHaveBeenCalledWith({
      phone: '+5571987654321',
      message: 'Olá, mundo!',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Message enqueued successfully' });
  });
});
