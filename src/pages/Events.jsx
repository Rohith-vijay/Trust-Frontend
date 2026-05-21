// src/pages/Events.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Custom Axios Interceptor client

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events')
      .then(res => {
        // Handle both standardized envelope or raw array bindings seamlessly
        const dataPayload = res.data || res;
        const eventsList = dataPayload.content || (Array.isArray(dataPayload) ? dataPayload : []);
        setEvents(eventsList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-blue-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue-light text-brand-blue-accent uppercase tracking-wider">
            Deployments
          </span>
          <h2 className="text-3xl font-black text-brand-slate-dark tracking-tight mt-3 animate-fade-in">
            Active & Upcoming Campaigns
          </h2>
          <div className="w-16 h-1 bg-brand-blue-accent mx-auto mt-3 rounded-full" />
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-blue-light/60 shadow-xs">
            <span className="text-5xl block mb-4">📅</span>
            <h3 className="text-lg font-bold text-brand-slate-dark">No events currently scheduled</h3>
            <p className="text-gray-400 mt-1 max-w-sm mx-auto text-sm">Please check back soon for our next outreach schedules and deployments.</p>
          </div>
        ) : (
          /* Reverted Compact 3-Column Responsive Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isCompleted = event.status === "COMPLETED" || event.status === "completed";

              return (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-white rounded-2xl border border-brand-blue-light/60 overflow-hidden p-5 flex flex-col justify-between shadow-xs transition-all duration-300 cursor-pointer hover:shadow-md hover:border-brand-blue-accent/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-brand-blue-accent uppercase tracking-wide bg-brand-blue-light/40 px-2.5 py-1 rounded-lg">
                        {event.category || "General Relief"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black border uppercase ${
                        isCompleted ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {event.status || "UPCOMING"}
                      </span>
                    </div>

                    {event.bannerUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                        <img 
                          src={event.bannerUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                          loading="lazy"
                        />
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-brand-slate-dark mb-2 hover:text-brand-navy-dark transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-5 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    {isCompleted ? (
                      <button 
                        disabled
                        className="w-full py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl text-sm cursor-not-allowed border border-gray-200"
                      >
                        Registration Closed
                      </button>
                    ) : (
                      <Link 
                        className="block w-full text-center py-2.5 bg-brand-gold hover:bg-brand-navy-dark text-white font-brand font-bold rounded-xl text-sm transition-colors duration-200 shadow-xs" 
                        to={`/events/${event.id}`}
                      >
                        View Details & Apply
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
