import EventForm from "@/components/admin/EventForm";

export default function CreateEventPage() {
  return (
    <div>

      <h1 className="text-4xl font-bold text-gray-900">
        Create Event
      </h1>


      <p className="mt-2 text-gray-600">
        Add a new event to tixel.
      </p>


      <div className="mt-8">
        <EventForm />
      </div>


    </div>
  );
}