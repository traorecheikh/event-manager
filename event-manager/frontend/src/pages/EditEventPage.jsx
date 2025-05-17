import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/EventForm';
// Updated to directly use getEvents for fetching single event by ID
import { getEvents, updateEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Alert, CircularProgress, Box, Typography } from '@mui/material';

// The placeholder fetchEventById function is removed.

function EditEventPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { currentUser } = useAuth();

  const [initialEvent, setInitialEvent] = useState(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For loading errors
  const [submitErrorMessage, setSubmitErrorMessage] = useState(''); // For submission errors

  useEffect(() => {
    const loadEvent = async () => {
      if (!currentUser) {
        setErrorMessage('Authentication error. Please log in.');
        setIsLoadingEvent(false);
        return;
      }
      if (!eventId) { // Should not happen if route is set up correctly
        setErrorMessage('Event ID is missing.');
        setIsLoadingEvent(false);
        return;
      }
      setIsLoadingEvent(true);
      setErrorMessage('');
      try {
        // Directly use getEvents with eventId to fetch the specific event.
        // This assumes getEvents is adapted to fetch a single event when an ID is passed,
        // and the backend supports GET /api/events/:id.
        const event = await getEvents(eventId);
        if (!event) { // If getEvents returns null/undefined for a non-existent ID
            setErrorMessage('Event not found.');
            setInitialEvent(null);
        } else if (event.cree_par !== currentUser.id) {
            setErrorMessage('You are not authorized to edit this event.');
            setInitialEvent(null);
        } else {
            setInitialEvent(event);
        }
      } catch (error) {
        console.error('Failed to load event for editing:', error);
        // Check if the error is because the event was not found (e.g. 404 from backend)
        if (error.response && error.response.status === 404) {
            setErrorMessage('Event not found.');
        } else {
            setErrorMessage(error.message || 'Failed to load event data. Please ensure you are connected and the event exists.');
        }
        setInitialEvent(null);
      } finally {
        setIsLoadingEvent(false);
      }
    };
    loadEvent();
  }, [eventId, currentUser]);

  const handleUpdateEvent = async (eventData) => {
    if (!currentUser) {
      setSubmitErrorMessage('You must be logged in to update an event.');
      return;
    }
    if (!initialEvent || initialEvent.cree_par !== currentUser.id) {
        setSubmitErrorMessage('You are not authorized to update this event.');
        return;
    }

    setIsSubmitting(true);
    setSubmitErrorMessage('');
    try {
      await updateEvent(eventId, eventData);
      // Consider showing a success snackbar before navigating
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update event:', error);
      setSubmitErrorMessage(error.response?.data?.message || error.message || 'Failed to update event. Please try again.');
      // No finally here, setIsSubmitting is handled below
    }
    setIsSubmitting(false); // Set to false regardless of success or failure if not navigating away on error
  };

  if (isLoadingEvent) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 5, flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ml: 2, mt: 1}}>Loading event data...</Typography>
      </Box>
    );
  }

  // This error message is for loading issues
  if (errorMessage && !initialEvent) { // Show error if event data could not be loaded
    return <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>;
  }

  // If after loading, initialEvent is still null (e.g. not found, or auth error specifically handled above)
  if (!initialEvent && !isLoadingEvent) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Event could not be loaded for editing. It may not exist or you might not be authorized.</Alert>;
  }

  return (
    <Container maxWidth="md">
      {/* This error message is for submission issues */}
      {submitErrorMessage && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{submitErrorMessage}</Alert>}
      {initialEvent && (
        <EventForm
          initialEvent={initialEvent}
          onSubmitForm={handleUpdateEvent}
          isSubmitting={isSubmitting}
          formTitle="Edit Event"
        />
      )}
    </Container>
  );
}

export default EditEventPage;

