import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Slider,
  FormHelperText,
  Fade,
  InputAdornment,
  Divider,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './EventForm.css';
import {
  CalendarMonth,
  LocationOn,
  Title,
  Description,
  People,
  ArrowBack,
  EventAvailable
} from '@mui/icons-material';

// This form will be used for both creating and editing events.
// Props:
// - `initialEvent` (object, optional): For pre-filling the form when editing an event.
// - `onSubmitForm` (function): Callback function to handle form submission. Receives event data.
// - `isSubmitting` (boolean): Indicates if the form submission is in progress.
// - `formTitle` (string): Title for the form (e.g., "Create Event" or "Edit Event").

function EventForm({ initialEvent, onSubmitForm, isSubmitting, formTitle }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setDescription(initialEvent.description || '');
      setDate(initialEvent.date ? new Date(initialEvent.date).toISOString().split('T')[0] : '');
      setLocation(initialEvent.location || '');
      setCapacity(initialEvent.capacity || '');
    }
  }, [initialEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitForm({ title, description, date, location, capacity });
  };

  const handleCapacityChange = (event, newValue) => {
    setCapacity(newValue);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper elevation={0} className="event-form-container">
        <Typography variant="h4" component="h1" className="form-title">
          {formTitle || 'Craft Your Event'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="form-input">
                  <TextField
                    name="title"
                    required
                    fullWidth
                    id="title"
                    label="Event Title"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Title sx={{ color: '#5E60CE' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText className="form-helper-text">
                    Choose a catchy name that represents your event
                  </FormHelperText>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="form-input">
                  <TextField
                    name="description"
                    fullWidth
                    id="description"
                    label="Event Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description sx={{ color: '#5E60CE' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText className="form-helper-text">
                    Describe what your event is all about
                  </FormHelperText>
                </div>
              </Grid>
            </Grid>
          </div>

          <Divider sx={{ my: 3, opacity: 0.6 }} />

          <div className="form-section">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <div className="form-input date-field">
                  <TextField
                    name="date"
                    required
                    fullWidth
                    id="date"
                    label="Event Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth sx={{ color: '#5E60CE' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="form-input">
                  <TextField
                    name="location"
                    required
                    fullWidth
                    id="location"
                    label="Event Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: '#5E60CE' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="form-input">
                  <Typography
                    id="capacity-slider"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#475569',
                      fontWeight: 500
                    }}
                  >
                    <People sx={{ color: '#5E60CE' }} />
                    Capacity: {capacity || 0} attendees
                  </Typography>
                  <Slider
                    className="capacity-slider"
                    value={Number(capacity) || 0}
                    onChange={handleCapacityChange}
                    aria-labelledby="capacity-slider"
                    step={5}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                      { value: 150, label: '150' },
                      { value: 200, label: '200+' }
                    ]}
                    min={0}
                    max={200}
                  />
                  <FormHelperText className="form-helper-text">
                    Maximum number of attendees for your event
                  </FormHelperText>
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="button-group">
            <Button
              className="cancel-button"
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
              startIcon={<ArrowBack />}
            >
              Cancel
            </Button>
            <Button
              className="submit-button"
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <EventAvailable />}
            >
              {isSubmitting ? 'Processing...' : (initialEvent ? 'Update Event' : 'Create Event')}
            </Button>
          </div>
        </Box>
      </Paper>
    </Fade>
  );
}

export default EventForm;

