import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>


      <div className="flex flex-wrap gap-4">

        <Link
          href="/admin/create-event"
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
        >
          + Create Event
        </Link>


        <button
          className="bg-gray-200 px-6 py-3 rounded-xl"
        >
          Manage Events
        </button>


        <button
          className="bg-gray-200 px-6 py-3 rounded-xl"
        >
          View Tickets
        </button>

      </div>

    </div>
  );
}