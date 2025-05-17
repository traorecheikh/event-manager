import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEvents, deleteEvent } from '../services/api';
import EventCard from '../components/EventCard';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Fab,
  Container,
  Grid,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
  Fade,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortIcon,
  Schedule as ScheduleIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Event as EventIcon,
  EventBusy as NoEventsIcon,
  DateRange as DateIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Import styles
import '../styles/Dashboard.css';

function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date-asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const fetchEvents = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const userEvents = await getEvents();
      setEvents(userEvents);
      setFilteredEvents(userEvents);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err.response?.data?.message || err.message || 'Could not load events.');
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  useEffect(() => {
    // Filter events based on search term
    if (searchTerm.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  useEffect(() => {
    // Sort events based on sort order
    let sorted = [...filteredEvents];
    switch(sortOrder) {
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'alpha-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alpha-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sort
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredEvents(sorted);
  }, [sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete.id);
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventToDelete.id));
      // No need to filter filteredEvents since it will be updated via the events useEffect
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError(err.response?.data?.message || err.message || 'Could not delete event.');
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getSortIcon = () => {
    if (sortOrder.includes('asc')) {
      return <ArrowUpIcon fontSize="small" />;
    }
    return <ArrowDownIcon fontSize="small" />;
  };

  const renderSortText = () => {
    if (sortOrder.includes('date')) {
      return 'Date';
    }
    return 'Name';
  };

  return (
    <Fade in={true} timeout={600}>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Typography variant="h4" component="h1" className="dashboard-title">
            Your Events
          </Typography>
          <Typography color="textSecondary">
            Manage and organize all your upcoming events
          </Typography>
        </div>

        {error && (
          <Alert
            severity="error"
            className="error-alert"
            action={
              <Button color="inherit" size="small" onClick={fetchEvents}>
                Try Again
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Paper className="search-filter-bar" elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <SearchIcon sx={{ color: 'var(--primary)' }}/>
            </IconButton>
            <InputBase
              className="search-input"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth={isMobile}
            />
          </Box>

          <Box className="filter-controls">
            <Stack
              direction="row"
              spacing={1}
              className="filter-chips"
              sx={{
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                overflowX: isMobile ? 'auto' : 'visible',
              }}
            >
              <Chip
                icon={<ScheduleIcon />}
                label="Sort:"
                className="filter-chip"
                variant="outlined"
              />

              <Chip
                label="Date"
                className={`filter-chip ${sortOrder.includes('date') ? 'active' : ''}`}
                onClick={() => handleSortChange(sortOrder === 'date-asc' ? 'date-desc' : 'date-asc')}
                clickable
                onDelete={sortOrder.includes('date') ? () => {} : undefined}
                deleteIcon={sortOrder.includes('date') ? getSortIcon() : undefined}
              />

              <Chip
                label="Name"
                className={`filter-chip ${sortOrder.includes('alpha') ? 'active' : ''}`}
                onClick={() => handleSortChange(sortOrder === 'alpha-asc' ? 'alpha-desc' : 'alpha-asc')}
                clickable
                onDelete={sortOrder.includes('alpha') ? () => {} : undefined}
                deleteIcon={sortOrder.includes('alpha') ? getSortIcon() : undefined}
              />
            </Stack>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map(item => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'rgba(0,0,0,0.08)',
                    }}
                  />
                  <Box sx={{ pt: 1 }}>
                    <Skeleton width="70%" height={28} />
                    <Skeleton width="40%" height={20} />
                    <Skeleton width="60%" height={24} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : filteredEvents.length === 0 ? (
          <Paper elevation={0} className="empty-state">
            <NoEventsIcon fontSize="large" className="empty-state-icon" />
            {events.length === 0 ? (
              <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'var(--neutral-dark)' }}>
                  No events yet
                </Typography>
                <Typography color="textSecondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Create your first event to get started. It's easy, just click the button below!
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/dashboard/create-event"
                  startIcon={<AddIcon />}
                  sx={{
                    background: 'linear-gradient(to right, var(--primary), var(--primary-dark))',
                    px: 3,
                    py: 1
                  }}
                >
                  Create Event
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'var(--neutral-dark)' }}>
                  No matching events
                </Typography>
                <Typography color="textSecondary" paragraph>
                  Try adjusting your search or filter to find what you're looking for.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSearchTerm('')}
                  sx={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                >
                  Clear Search
                </Button>
              </>
            )}
          </Paper>
        ) : (
          <Box className="events-container">
            {filteredEvents.map((event) => (
              <Zoom
                in={true}
                key={event.id}
                style={{ transitionDelay: `${filteredEvents.indexOf(event) * 50}ms` }}
              >
                <div>
                  <EventCard
                    event={event}
                    onDelete={() => handleDeleteClick(event)}
                    onEdit={() => navigate(`/dashboard/edit-event/${event.id}`)}
                  />
                </div>
              </Zoom>
            ))}
          </Box>
        )}

        <Zoom in={true} style={{ transitionDelay: loading ? '300ms' : '0ms' }}>
          <Fab
            color="primary"
            aria-label="add event"
            component={RouterLink}
            to="/dashboard/create-event"
            className="create-event-fab"
          >
            <AddIcon />
          </Fab>
        </Zoom>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{ className: "delete-dialog-paper" }}
        >
          <DialogTitle className="delete-dialog-title">
            Delete Event
          </DialogTitle>
          <DialogContent className="delete-dialog-content">
            <DialogContentText>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="delete-dialog-actions">
            <Button onClick={handleDeleteCancel} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" className="delete-confirm-button">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fade>
  );
}

export default DashboardPage;

