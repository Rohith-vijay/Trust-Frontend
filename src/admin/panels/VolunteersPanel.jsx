import React from "react";

const VolunteersPanel = ({ volunteerApps, onApproveVolunteer, onRejectVolunteer, formatDate, EmptyState }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Volunteer Applications</h3>
      {volunteerApps.length === 0 ? (
        <EmptyState
          icon="🤝"
          title="No volunteer applications yet."
          subtitle="Applications from the volunteer page will appear here."
        />
      ) : (
        <div className="space-y-3">
          {volunteerApps.map((app) => (
            <div
              key={app.id}
              className="border border-gray-100 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-bold text-brand-navy-dark">
                      {app.name || app.userName || `User #${app.userId}`}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {app.email}
                      {app.phone && <span className="mx-2">•</span>}
                      {app.phone}
                    </p>
                  </div>
                  {app.interest && (
                    <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                      Focus: {app.interest}
                    </div>
                  )}
                  {app.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-50 italic">
                      "{app.message}"
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Applied on: {formatDate(app.createdAt || app.appliedAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-start">
                  {app.status === "pending" || app.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => onApproveVolunteer(app.id)}
                        className="text-xs bg-emerald-500 text-white font-bold px-4 py-2 rounded-full hover:bg-emerald-600 shadow-sm shadow-emerald-500/10 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectVolunteer(app.id)}
                        className="text-xs bg-rose-500 text-white font-bold px-4 py-2 rounded-full hover:bg-rose-600 shadow-sm shadow-rose-500/10 transition"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs px-3.5 py-1.5 rounded-full font-bold ${
                        app.status === "approved" || app.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status === "approved" || app.status === "APPROVED"
                        ? "✓ Approved"
                        : "✕ Rejected"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteersPanel;
