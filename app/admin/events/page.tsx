import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { deleteEvent } from "@/lib/actions/deleteEvent";


export default async function AdminEventsPage() {


  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });



  if (error) {

    return (
      <div className="p-8">

        <h1 className="text-3xl font-bold">
          Error loading events
        </h1>

        <p className="text-red-600 mt-3">
          {error.message}
        </p>

      </div>
    );

  }




  return (

    <div className="p-8">


      <div className="flex justify-between items-center mb-10">


        <div>

          <h1 className="text-4xl font-bold">
            Manage Events
          </h1>

          <p className="text-gray-600 mt-2">
            View, edit and delete events
          </p>

        </div>



        <Link
          href="/admin/create-event"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          + Create Event
        </Link>


      </div>





      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">



        {events?.map((event) => (


          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >



            {event.banner_url ? (

              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

            ) : (

              <div className="h-48 bg-gray-200 flex items-center justify-center">
                No Image
              </div>

            )}






            <div className="p-6">


              <h2 className="text-xl font-bold">
                {event.title}
              </h2>



              <p className="text-gray-600 mt-2">
                📍 {event.venue}
              </p>



              <p className="text-gray-600">
                {event.city}, {event.country}
              </p>



              <p className="font-semibold mt-3">
                Price: ${event.ticket_price}
              </p>



              <p className="text-sm text-gray-500 mt-2">
                Date: {event.event_date}
              </p>



              <p className="text-sm mt-2">
                Status: {event.status}
              </p>





              <div className="flex gap-3 mt-6 flex-wrap">



                <Link
                  href={`/events/${event.id}`}
                  className="bg-black text-white px-4 py-2 rounded-xl"
                >
                  View
                </Link>





                <Link
                  href={`/admin/events/${event.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Edit
                </Link>







                <form
                  action={deleteEvent.bind(null, event.id)}
                >

                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>


                </form>





              </div>




            </div>



          </div>


        ))}



      </div>



    </div>

  );

}