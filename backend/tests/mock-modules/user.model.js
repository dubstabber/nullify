// Mock User model for tests
import { jest } from '@jest/globals';
import { mockUserModel } from '../mocks.js';

// Create the User mock object with jest.fn()
const User = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  countDocuments: jest.fn(),
  // Support for model instantiation
  prototype: {
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    })
  }
};

// Setup default mock implementations
User.find.mockReturnValue({
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([])
});

User.findById.mockReturnValue({
  exec: jest.fn().mockResolvedValue({
    _id: 'default-mock-id',
    username: 'mockuser',
    email: 'mock@example.com',
    role: 'user',
    isAdmin: false
  })
});

User.create.mockImplementation((data) => {
  return Promise.resolve({
    _id: 'mock-user-id',
    ...data
  });
});

User.findOne.mockReturnValue({
  exec: jest.fn().mockResolvedValue({
    _id: 'mock-user-id',
    username: 'mockuser',
    email: 'mock@example.com',
    role: 'user',
    isAdmin: false,
    verifyPassword: jest.fn().mockReturnValue(true)
  })
});

User.countDocuments.mockResolvedValue(50);

const UserMock = mockUserModel;
export { UserMock };
export default UserMock;
