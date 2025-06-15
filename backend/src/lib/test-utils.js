export const mockObjectId = (id = 'mockedid') => {
  const objectId = id;
  objectId.toString = () => id.toString();
  return objectId;
};

export const setupMongooseMocks = () => {
  const mockModels = {
    Album: {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn()
    },
    Song: {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn()
    },
    User: {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      countDocuments: jest.fn()
    }
  };
  
  return { mockModels };
};

export const mockReq = (overrides = {}) => {
  return {
    params: {},
    query: {},
    body: {},
    user: { sub: 'user123', name: 'Test User' },
    ...overrides
  };
};

export const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
