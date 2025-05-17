const eventService = require('./eventService');
const { Event } = require('../models/Event');
const { User } = require('../models/User');

jest.mock('../models/Event');
jest.mock('../models/User');

describe('eventService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create and return a new event', async () => {
      const mockEvent = { id: 1, title: 'Test', userId: 2 };
      Event.create.mockResolvedValue(mockEvent);
      const result = await eventService.createEvent({ title: 'Test' }, 2);
      expect(Event.create).toHaveBeenCalledWith({ title: 'Test', userId: 2 });
      expect(result).toBe(mockEvent);
    });
  });

  describe('getEvents', () => {
    it('should return all published events', async () => {
      const mockEvents = [{ id: 1 }, { id: 2 }];
      Event.findAll.mockResolvedValue(mockEvents);
      const result = await eventService.getEvents();
      expect(Event.findAll).toHaveBeenCalledWith({
        include: [{ model: User, attributes: ['username'] }],
        where: { status: 'published' },
        order: [['date', 'ASC']]
      });
      expect(result).toBe(mockEvents);
    });
  });

  describe('getUserEvents', () => {
    it('should return events for a user', async () => {
      const mockEvents = [{ id: 1 }];
      Event.findAll.mockResolvedValue(mockEvents);
      const result = await eventService.getUserEvents(2);
      expect(Event.findAll).toHaveBeenCalledWith({
        where: { userId: 2 },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toBe(mockEvents);
    });
  });

  describe('getEvent', () => {
    it('should return an event by id', async () => {
      const mockEvent = { id: 1 };
      Event.findOne.mockResolvedValue(mockEvent);
      const result = await eventService.getEvent(1);
      expect(Event.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        include: [{ model: User, attributes: ['username'] }]
      });
      expect(result).toBe(mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update and return the event if found', async () => {
      const mockEvent = { update: jest.fn(), id: 1 };
      Event.findOne.mockResolvedValue(mockEvent);
      mockEvent.update.mockResolvedValue(mockEvent);
      const result = await eventService.updateEvent(1, 2, { title: 'New' });
      expect(Event.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 2 } });
      expect(mockEvent.update).toHaveBeenCalledWith({ title: 'New' });
      expect(result).toBe(mockEvent);
    });
    it('should return null if event not found', async () => {
      Event.findOne.mockResolvedValue(null);
      const result = await eventService.updateEvent(1, 2, { title: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event if found', async () => {
      const mockEvent = { destroy: jest.fn() };
      Event.findOne.mockResolvedValue(mockEvent);
      mockEvent.destroy.mockResolvedValue();
      const result = await eventService.deleteEvent(1, 2);
      expect(Event.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 2 } });
      expect(mockEvent.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    it('should return null if event not found', async () => {
      Event.findOne.mockResolvedValue(null);
      const result = await eventService.deleteEvent(1, 2);
      expect(result).toBeNull();
    });
  });
});

