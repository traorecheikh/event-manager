const { Event, User } = require('../models');

const createEvent = async (eventData, userId) => {
  // Log the eventData for debugging
  console.log('createEvent eventData:', eventData);
  // Ensure status is 'published' by default if not provided
  const status = eventData.status || 'published';
  return await Event.create({ ...eventData, userId, status });
};

const getEvents = async () => {
  return await Event.findAll({
    include: [{ model: User, attributes: ['email'] }],
    where: { status: 'published' },
    order: [['date', 'ASC']]
  });
};

const getUserEvents = async (userId) => {
  return await Event.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
};

const getEvent = async (eventId) => {
  return await Event.findOne({
    where: { id: eventId },
    include: [{ model: User, attributes: ['email'] }]
  });
};

const updateEvent = async (eventId, userId, updateData) => {
  const event = await Event.findOne({ where: { id: eventId, userId } });
  if (!event) return null;
  await event.update(updateData);
  return event;
};

const deleteEvent = async (eventId, userId) => {
  const event = await Event.findOne({ where: { id: eventId, userId } });
  if (!event) return null;
  await event.destroy();
  return true;
};

// More service functions (getEvent, updateEvent, deleteEvent) can be added here as needed

module.exports = {
  createEvent,
  getEvents,
  getUserEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};

