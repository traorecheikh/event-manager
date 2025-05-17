const eventService = require('../services/eventService');
const logger = require('../config/logger');

const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    logger.info({ eventId: event.id }, 'Event created');
    res.status(201).json(event);
  } catch (error) {
    logger.error(error, 'Error creating event');
    res.status(400).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await eventService.getEvents();
    res.json(events);
  } catch (error) {
    logger.error(error, 'Error fetching events');
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const events = await eventService.getUserEvents(req.user.id);
    res.json(events);
  } catch (error) {
    logger.error(error, 'Error fetching user events');
    res.status(500).json({ message: 'Error fetching user events' });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await eventService.getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    logger.error(error, 'Error fetching event');
    res.status(500).json({ message: 'Error fetching event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.user.id, req.body);
    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }
    logger.info({ eventId: event.id }, 'Event updated');
    res.json(event);
  } catch (error) {
    logger.error(error, 'Error updating event');
    res.status(400).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const deleted = await eventService.deleteEvent(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }
    logger.info({ eventId: req.params.id }, 'Event deleted');
    res.status(204).send();
  } catch (error) {
    logger.error(error, 'Error deleting event');
    res.status(500).json({ message: 'Error deleting event' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getUserEvents
};

