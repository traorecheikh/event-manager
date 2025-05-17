import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  Avatar,
  IconButton,
  CardMedia,
  Stack,
  Tooltip,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarMonth, 
  LocationOn, 
  Person, 
  EditOutlined, 
  DeleteOutline,
  PeopleAlt,
  AccessTime
} from '@mui/icons-material';

// Generate a random color from a predefined set of pleasing colors based on the event id
const getEventColor = (eventId) => {
  const colors = [
    'linear-gradient(135deg, #5E60CE, #6930C3)',
    'linear-gradient(135deg, #56B4D3, #348F50)',
    'linear-gradient(135deg, #9D50BB, #6E48AA)',
    'linear-gradient(135deg, #4776E6, #8E54E9)',
    'linear-gradient(135deg, #11998e, #38ef7d)'
  ];
  
  // Use the event id string to determine a consistent color
  if (!eventId) return colors[0];
  
  const charSum = eventId.toString().split('').reduce((sum, char) => {
    return sum + char.charCodeAt(0);
  }, 0);
  
  return colors[charSum % colors.length];
};

function EventCard({ event, onEdit, onDelete }) {
  const { currentUser } = useAuth();
  const isOwner = currentUser && event.userId === currentUser.id;

  if (!event) return null;

  // Format the date for display
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Date not available';
    }
  };
  
  // Generate event color based on event id
  const eventColor = getEventColor(event.id);

  return (
    <Card className="event-card">
      <CardMedia
        sx={{
          height: 140,
          background: eventColor,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 2
        }}
      >
        <Box sx={{ 
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-md)',
          px: 1.5,
          py: 0.5,
          backdropFilter: 'blur(8px)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          <AccessTime sx={{ fontSize: 16, color: 'var(--primary)' }} />
          <Typography variant="caption" fontWeight="600">
            {formatDate(event.date)}
          </Typography>
        </Box>
      </CardMedia>

      <CardContent className="event-card-content">
        <Typography variant="h6" className="event-card-title" gutterBottom component="h3" noWrap>
          {event.title || 'Untitled Event'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          mb: 2,
          height: '3em'
        }}>
          {event.description || 'No description provided for this event.'}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--neutral-medium)',
          mb: 1.5
        }}>
          <LocationOn sx={{ fontSize: 18, mr: 1, color: 'var(--primary)' }} />
          <Typography variant="body2" noWrap>
            {event.location || 'Location not specified'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 'auto' }}>
          <Chip
            icon={<PeopleAlt sx={{ fontSize: '0.8rem !important' }} />}
            label={`${event.capacity || 0} attendees`}
            size="small"
            sx={{ 
              background: 'rgba(94, 96, 206, 0.08)',
              color: 'var(--primary-dark)',
              fontWeight: 500,
              borderRadius: 'var(--radius-pill)',
              '& .MuiChip-icon': { color: 'var(--primary)' }
            }}
          />
        </Box>
      </CardContent>

      <Divider />
      
      <CardActions className="event-card-actions">
        <Tooltip title="Edit Event">
          <Button 
            size="small" 
            color="primary" 
            onClick={onEdit} 
            startIcon={<EditOutlined />}
            sx={{
              textTransform: 'none', 
              fontWeight: 500,
              color: 'var(--primary)',
              '&:hover': { 
                background: 'rgba(94, 96, 206, 0.08)'
              }
            }}
          >
            Edit
          </Button>
        </Tooltip>
        
        <Tooltip title="Delete Event">
          <Button 
            size="small" 
            color="error" 
            onClick={onDelete}
            startIcon={<DeleteOutline />}
            sx={{
              textTransform: 'none', 
              fontWeight: 500,
              '&:hover': { 
                background: 'rgba(239, 68, 68, 0.08)'
              }
            }}
          >
            Delete
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default EventCard;

