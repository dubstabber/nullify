import { jest } from '@jest/globals';
import express from 'express';
import cors from 'cors';

// Mock express function
const mockExpress = () => {
  const app = {
    use: jest.fn().mockReturnThis(),
    listen: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    address: jest.fn().mockReturnValue({ port: 3000 })
  };
  return app;
};

// Mock express module
jest.mock('express', () => mockExpress);

// Create the app
const app = mockExpress();

// Mock middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock routes
app.post('/api/admin/songs', (req, res) => {
  res.status(201).json({ message: 'Song created' });
});

app.delete('/api/admin/songs/:id', (req, res) => {
  res.status(200).json({ message: 'Song deleted successfully' });
});

app.post('/api/admin/albums', (req, res) => {
  res.status(201).json({ message: 'Album created' });
});

app.delete('/api/admin/albums/:id', (req, res) => {
  res.status(200).json({ message: 'Album deleted successfully' });
});

export { app }; 