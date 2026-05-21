import React from "react";

const DonationsPanel = ({
  donations,
  donationPage,
  totalDonationPages,
  tabLoading,
  onLoadDonations,
  formatDate,
  LoadingSpinner,
  EmptyState
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-navy-dark">Donation Transactions</h3>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3.5 py-1.5 rounded-full">
          Real-time Audit Ledger
        </span>
      </div>

      {tabLoading ? (
        <LoadingSpinner />
      ) : !Array.isArray(donations) || donations.length === 0 ? (
        <EmptyState
          icon="💰"
          title="No donations recorded."
          subtitle="Donation transaction history will appear here once received."
        />
      ) : (
        <div>
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-bold bg-gray-50/50">
                  <th className="py-4 px-5">ID / Receipt No</th>
                  <th className="py-4 px-5">Donor Particulars</th>
                  <th className="py-4 px-5">Donated Amount</th>
                  <th className="py-4 px-5">Gateway Status</th>
                  <th className="py-4 px-5">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((don) => (
                  <tr
                    key={don.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="font-bold text-brand-navy-dark">#{don.id}</div>
                      <div className="text-xs text-gray-400 font-medium">{don.receiptNumber || "—"}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-brand-navy-dark">{don.donorName || "Anonymous"}</div>
                      <div className="text-xs text-gray-500 font-medium">{don.donorEmail || "no-email@trust.org"}</div>
                    </td>
                    <td className="py-4 px-5 font-black text-gray-900">
                      ₹{Number(don.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold inline-block border ${
                          don.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : don.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {don.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-500 font-medium">{formatDate(don.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalDonationPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <button
                disabled={donationPage === 0 || tabLoading}
                onClick={() => onLoadDonations(donationPage - 1)}
                className="px-4.5 py-2 border rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Previous Page
              </button>
              <span className="text-xs font-bold text-gray-500">
                Page {donationPage + 1} of {totalDonationPages}
              </span>
              <button
                disabled={donationPage >= totalDonationPages - 1 || tabLoading}
                onClick={() => onLoadDonations(donationPage + 1)}
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

export default DonationsPanel;
