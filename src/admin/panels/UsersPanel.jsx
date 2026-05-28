import React from "react";

const UsersPanel = ({
  users,
  userPage,
  tabLoading,
  setUserPage,
  onRoleChange,
  LoadingSpinner,
  EmptyState
}) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const usersPerPage = 10;
  const totalUserPages = Math.ceil(safeUsers.length / usersPerPage);
  const paginatedUsers = safeUsers.slice(userPage * usersPerPage, (userPage + 1) * usersPerPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-navy-dark">User Access Management</h3>
        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-full border border-indigo-100">
          Total Registered: {safeUsers.length} Users
        </span>
      </div>

      {tabLoading ? (
        <LoadingSpinner />
      ) : !Array.isArray(users) || users.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No users found."
          subtitle="Registered accounts will populate this list."
        />
      ) : (
        <div>
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-bold bg-gray-50/50">
                  <th className="py-4 px-6">Profile Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Access Clearance</th>
                  <th className="py-4 px-6">Change Authority Role</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-brand-navy-dark">{u.name || "—"}</td>
                    <td className="py-4 px-6 text-gray-500 font-semibold">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold inline-block border ${
                          u.role === "ADMIN"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : u.role === "VOLUNTEER"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                            : "bg-gray-50 text-gray-700 border-gray-100"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => onRoleChange(u.id, e.target.value)}
                        className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer shadow-sm"
                      >
                        <option value="USER">USER (General)</option>
                        <option value="VOLUNTEER">VOLUNTEER (Field)</option>
                        <option value="ADMIN">ADMIN (Full access)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalUserPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <button
                disabled={userPage === 0}
                onClick={() => setUserPage(userPage - 1)}
                className="px-4.5 py-2 border rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Previous Page
              </button>
              <span className="text-xs font-bold text-gray-500">
                Page {userPage + 1} of {totalUserPages}
              </span>
              <button
                disabled={userPage >= totalUserPages - 1}
                onClick={() => setUserPage(userPage + 1)}
                className="px-4.5 py-2 border rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
