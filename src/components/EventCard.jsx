import React from "react";
import { motion } from "framer-motion";
import { Card, CardMedia, CardContent, Typography, Chip, IconButton, Box } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from "react-router-dom";

const EventCard = React.memo(({ event }) => {
  const nav = useNavigate();
  const navigate = React.useCallback(() => {
    nav(`/events/${event.id}`);
  }, [nav, event.id]);

  const getPrimaryImage = () => {
    if (event.bannerUrl) return event.bannerUrl.split(',')[0];
    if (event.image) return event.image.split(',')[0];
    if (event.media?.[0]?.mediaUrl) return event.media[0].mediaUrl;
    return null;
  };
  const imageUrl = getPrimaryImage();
  const displayDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : event.date || "";
  const summaryText = event.summary || event.description || "";
  const location = event.location || "";
  const category = event.category || "";

  // Calculate Urgency (less than 3 days until registration deadline or event date)
  const isUrgent = React.useMemo(() => {
    if (event.status !== "UPCOMING") return false;
    const targetDateStr = event.registrationDeadline || event.eventDate;
    if (!targetDateStr) return false;
    const targetDate = new Date(targetDateStr);
    const diffTime = targetDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }, [event.status, event.registrationDeadline, event.eventDate]);

  // Calculate Volunteer progress
  const volunteerPercentage = React.useMemo(() => {
    if (!event.maxVolunteers || event.maxVolunteers <= 0) return 0;
    return Math.min(100, Math.round(((event.currentVolunteerCount || 0) / event.maxVolunteers) * 100));
  }, [event.currentVolunteerCount, event.maxVolunteers]);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <Card
        onClick={navigate}
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 5,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 35px rgba(176, 122, 63, 0.08), 0 4px 15px rgba(0,0,0,0.04)',
            borderColor: 'rgba(176, 122, 63, 0.15)'
          }
        }}
      >
        {imageUrl && (
          <div className="relative overflow-hidden group h-[220px] shrink-0">
            <CardMedia
              component="img"
              height="220"
              image={imageUrl}
              alt={event.title}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            
            {event.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-12">
                <Typography variant="caption" sx={{ color: 'white', fontStyle: 'italic', fontWeight: 500, opacity: 0.9 }}>
                  "{event.caption}"
                </Typography>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              {category ? (
                <Chip
                  label={category.toUpperCase()}
                  size="small"
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '0.65rem',
                    bgcolor: 'rgba(255, 255, 255, 0.95)', 
                    color: 'primary.main',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
              ) : <div />}

              <div className="flex flex-col gap-2 items-end">
                {event.status && (
                  <Chip
                    label={event.status}
                    size="small"
                    color={
                      event.status === "UPCOMING" ? "success" :
                      event.status === "ONGOING" ? "warning" :
                      event.status === "COMPLETED" ? "default" : "default"
                    }
                    sx={{ 
                      fontWeight: 750, 
                      fontSize: '0.65rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                  />
                )}

                {isUrgent && (
                  <Chip
                    icon={<ErrorIcon style={{ fontSize: 12, color: 'white' }} />}
                    label="CLOSING SOON"
                    size="small"
                    color="error"
                    sx={{ 
                      fontWeight: 750, 
                      fontSize: '0.65rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                      letterSpacing: '0.5px',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.35, mb: 1.5, minHeight: '3.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.title}
          </Typography>
          
          <div className="flex flex-col gap-1.5 mb-4 text-gray-500 text-xs font-medium">
            {displayDate && (
              <div className="flex items-center gap-2">
                <CalendarTodayIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <span>{displayDate}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <LocationOnIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
          
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, mb: 3 }}>
            {summaryText}
          </Typography>

          {/* Volunteer progress bar */}
          {event.maxVolunteers && event.maxVolunteers > 0 ? (
            <Box sx={{ mb: 2 }}>
              <div className="flex justify-between text-[11px] text-gray-500 mb-1 font-semibold">
                <div className="flex items-center gap-1">
                  <PeopleIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                  <span>Volunteer Allocation</span>
                </div>
                <span>{event.currentVolunteerCount || 0} / {event.maxVolunteers} slots</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    volunteerPercentage >= 100 ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                    volunteerPercentage >= 80 ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                    'bg-gradient-to-r from-amber-500 to-amber-600'
                  }`}
                  style={{ width: `${volunteerPercentage}%` }}
                />
              </div>
            </Box>
          ) : null}

          {event.instagramLink && (
            <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Follow Campaign Updates
              </Typography>
              <IconButton 
                size="small" 
                href={event.instagramLink} 
                target="_blank" 
                onClick={(e) => e.stopPropagation()}
                sx={{ 
                  color: '#E1306C', 
                  bgcolor: 'rgba(225, 48, 108, 0.08)', 
                  '&:hover': { bgcolor: 'rgba(225, 48, 108, 0.15)' },
                  transition: 'all 0.2s'
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default EventCard;
