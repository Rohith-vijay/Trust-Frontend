import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ScrollStagger } from '../components/MotionContainer';
import { CardGridSkeleton } from '../components/SkeletonLoader';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UPCOMING, ONGOING, COMPLETED
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events?size=100') // Fetch a larger set to handle client-side filtering robustly
      .then(res => {
        const dataPayload = res.data || res;
        const eventsList = dataPayload.content || (Array.isArray(dataPayload) ? dataPayload : []);
        setEvents(eventsList);
        setFilteredEvents(eventsList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter events based on active tab and dynamic status computed
  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => {
        const status = (e.status || 'UPCOMING').toUpperCase();
        return status === activeTab;
      }));
    }
  }, [activeTab, events]);

  // Helper to extract first image from potentially comma-separated banner urls
  const getThumbnail = (event) => {
    if (event.coverImageUrl) return event.coverImageUrl;
    if (!event.bannerUrl) return '';
    return event.bannerUrl.split(',')[0].trim();
  };

  const getStatusStyle = (status) => {
    const s = (status || 'UPCOMING').toUpperCase();
    switch (s) {
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'ONGOING':
        return 'bg-brand-blue-100 text-brand-blue-700 border-brand-blue-200';
      case 'UPCOMING':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-warmBg py-16 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-brand-navy-dark text-white uppercase tracking-wider shadow-sm">
            Impact Initiatives
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-navy-dark tracking-tight mt-4 font-heading">
            Our Outreach Programs & Initiatives
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
            Evolving outreach deployments into permanent initiatives of change. Explore our campaigns and stand with us.
          </p>
          <div className="w-20 h-1.5 bg-brand-gold mx-auto mt-4 rounded-full" />
        </div>

        {/* Tab Filters */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/70 p-1.5 rounded-2xl shadow-md border border-gray-200 backdrop-blur-md">
            {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-brand-navy-dark text-white shadow-md'
                    : 'text-gray-500 hover:text-brand-navy-dark hover:bg-white/60'
                }`}
              >
                {tab === 'ALL' ? 'All Initiatives' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Initiatives Roster */}
        {loading ? (
          <CardGridSkeleton count={6} />
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-brand-blue-light/60 shadow-lg max-w-xl mx-auto">
            <span className="text-6xl block mb-4">📅</span>
            <h3 className="text-xl font-bold text-brand-navy-dark">No initiatives found</h3>
            <p className="text-gray-500 mt-2 text-sm px-6">
              There are no {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} impact initiatives currently listable. Check back soon!
            </p>
          </div>
        ) : (
          <ScrollStagger 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            margin="-60px"
          >
            {filteredEvents.map((event) => {
              const status = (event.status || 'UPCOMING').toUpperCase();
              const eventDateParsed = (() => {
                if (!event.eventDate) return '';
                const d = new Date(event.eventDate);
                if (isNaN(d.getTime())) return '';
                return d.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              })();

              return (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-brand-gold/20 group"
                >
                  <div>
                    {/* Header Image with overlay status */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {getThumbnail(event) ? (
                        <img 
                          src={getThumbnail(event)} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-navy-dark/5 text-brand-navy-dark">
                          <CalendarMonthIcon style={{ fontSize: 40 }} />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-wider bg-brand-navy-dark px-3 py-1 rounded-full shadow-md">
                          {event.category || "General Relief"}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border shadow-md uppercase ${getStatusStyle(status)}`}>
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-brand-navy-dark mb-2 tracking-tight group-hover:text-brand-gold transition-colors duration-300 font-heading">
                        {event.title}
                      </h3>
                      {event.subtitle && (
                        <p className="text-xs text-brand-gold font-bold mb-3 uppercase tracking-wider">
                          {event.subtitle}
                        </p>
                      )}
                      <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        {eventDateParsed && (
                          <div className="flex items-center">
                            <AccessTimeIcon fontSize="inherit" className="mr-2 text-brand-navy-dark/60" />
                            <span>{eventDateParsed}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <LocationOnIcon fontSize="inherit" className="mr-2 text-brand-navy-dark/60" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.maxVolunteers && (
                          <div className="flex items-center">
                            <GroupsIcon fontSize="inherit" className="mr-2 text-brand-navy-dark/60" />
                            <span>{event.currentVolunteerCount || 0} / {event.maxVolunteers} Volunteers</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic CTA Footer Section */}
                  <div className="p-6 pt-0" onClick={(e) => e.stopPropagation()}>
                    {status === 'COMPLETED' ? (
                      <Link 
                        className="block w-full text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all duration-300 shadow-sm border border-gray-200" 
                        to={`/events/${event.id}`}
                      >
                        View Highlights & Gallery
                      </Link>
                    ) : status === 'ONGOING' ? (
                      <Link 
                        className="block w-full text-center py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl text-xs transition-all duration-300 shadow-lg border border-brand-blue-600/20" 
                        to={`/events/${event.id}`}
                      >
                        Join Initiative Now
                      </Link>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link 
                          className="block text-center py-3 bg-gray-50 hover:bg-gray-100 text-brand-navy-dark font-bold rounded-xl text-xs transition-all border border-gray-200 duration-300"
                          to={`/events/${event.id}`}
                        >
                          Details
                        </Link>
                        <Link 
                          className="block text-center py-3 bg-brand-gold hover:bg-brand-navy-dark text-white font-bold rounded-xl text-xs transition-all duration-300 shadow-md" 
                          to={`/events/${event.id}`}
                        >
                          Volunteer
                        </Link>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </ScrollStagger>
        )}

      </div>
    </div>
  );
}
