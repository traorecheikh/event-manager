import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { createEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Alert } from '@mui/material';

function CreateEventPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Needed for cree_par, though backend handles it via token
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateEvent = async (eventData) => {
    if (!currentUser) {
      setErrorMessage('You must be logged in to create an event.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // The backend will use req.user.id for cree_par
      await createEvent(eventData);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error('Failed to create event:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to create event. Please try again.');
      setIsSubmitting(false);
    }
    // No need to setIsSubmitting(false) on success due to navigation
  };

  return (
    <Container maxWidth="md">
      {errorMessage && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{errorMessage}</Alert>}
      <EventForm
        onSubmitForm={handleCreateEvent}
        isSubmitting={isSubmitting}
        formTitle="Create New Event"
      />
    </Container>
  );
}

export default CreateEventPage;

