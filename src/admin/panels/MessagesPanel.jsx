import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MessagesPanel = ({ messages, unreadCount, onMarkRead, onDeleteMessage, formatDate, EmptyState }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-navy-dark">
          Contact Messages
          {unreadCount > 0 && (
            <span className="ml-2 text-sm text-red-500 font-normal">
              ({unreadCount} unread)
            </span>
          )}
        </h3>
      </div>
      {messages.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No messages yet."
          subtitle="Messages from the contact form will appear here."
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`border rounded-2xl p-5 transition-all ${
                  msg.read
                    ? "border-gray-100 bg-white"
                    : "border-primary/20 bg-primary/5 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <h4 className="font-semibold text-brand-navy-dark truncate">
                        {msg.name}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{msg.email}</p>
                    <p className="text-sm text-gray-700 mt-3 whitespace-pre-line leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                    {!msg.read && (
                      <button
                        onClick={() => onMarkRead(msg.id)}
                        className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full font-bold transition duration-300"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1.5 rounded-full hover:bg-red-50 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;
