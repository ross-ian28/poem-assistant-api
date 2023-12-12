const app = require('./../server.js');
const supertest = require('supertest');

const request = supertest(app);

describe('End-to-End Tests', () => {
    describe('Poem Prompt Generator', () => {
        it('should respond with poem prompts', async () => {
            const response = await request.post('/prompt-generator').send({ amount: 3 });
        
            expect(response.status).toBe(200);
            expect(response.body.message).toBeDefined();
        });

        it('should still respond if no amount is given', async () => {
            const response = await request.post('/prompt-generator').send({ message: "Go to the fence and jump over it" });
        
            expect(response.status).toBe(200);
            expect(response.body.message).toBeDefined();
          });
    })
  
    it('should check grammar', async () => {
      const response = await request.post('/grammar-checker').send({ message: 'Sample text' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });
