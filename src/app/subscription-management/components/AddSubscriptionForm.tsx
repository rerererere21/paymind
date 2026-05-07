export default function AddSubscriptionForm() {
  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-[800] text-[#14213D] leading-tight">
          Add Subscription
        </h1>

        <p className="text-[15px] text-[#64748B] mt-1">
          Track a new recurring service
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-sm p-8 space-y-8">

        {/* SECTION 1 */}
        <div className="space-y-5">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold">
              1
            </div>

            <h2 className="text-xl font-[700] text-[#14213D]">
              Service Details
            </h2>
          </div>

          <div>
            <label className="block text-sm font-[600] mb-2">
              Service name
            </label>

            <input
              type="text"
              placeholder="e.g. Netflix, Spotify"
              className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-[600] mb-2">
                Category
              </label>

              <select className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none">
                <option>Entertainment</option>
                <option>Food</option>
                <option>Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-[600] mb-2">
                Status
              </label>

              <select className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none">
                <option>Active</option>
                <option>Paused</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-sm font-[600] mb-2">
              Website
            </label>

            <input
              type="text"
              placeholder="e.g. netflix.com"
              className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none"
            />
          </div>

        </div>

        {/* SECTION 2 */}
        <div className="border-t pt-8 space-y-5">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold">
              2
            </div>

            <h2 className="text-xl font-[700] text-[#14213D]">
              Billing Details
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-[600] mb-2">
                Price
              </label>

              <input
                type="number"
                placeholder="0.00"
                className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-[600] mb-2">
                Billing cycle
              </label>

              <select className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none">
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-sm font-[600] mb-2">
              Start date
            </label>

            <input
              type="date"
              className="w-full h-12 px-4 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none"
            />
          </div>

        </div>

        {/* SECTION 3 */}
        <div className="border-t pt-8 space-y-5">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold">
              3
            </div>

            <h2 className="text-xl font-[700] text-[#14213D]">
              Notes
            </h2>
          </div>

          <textarea
            rows={4}
            placeholder="Add notes..."
            className="w-full px-4 py-3 rounded-xl border border-[#D7E2F0] bg-[#F8FBFF] outline-none resize-none"
          />

        </div>

        {/* BUTTONS */}
        <div className="border-t pt-6 flex gap-4">

          <button
            type="button"
            className="flex-1 h-12 rounded-xl border border-[#D7E2F0] bg-[#F8FAFC] font-[600]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 h-12 rounded-xl bg-[#1E3A8A] text-white font-[600] hover:bg-[#1D4ED8] transition-all"
          >
            Add subscription
          </button>

        </div>

      </div>

    </div>
  );
}