import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";


export default async function EventsPage(){

  const {data:events,error}=await supabase
    .from("events")
    .select("*")
    .order("created_at",{ascending:false});


  if(error){
    console.log(error);
  }


return (

<main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100 p-10">


<h1 className="text-5xl font-black mb-12">
🎤 Upcoming Events
</h1>



<div className="grid md:grid-cols-3 gap-10">


{
events?.map((event)=>(


<div
key={event.id}
className="
bg-white
rounded-3xl
shadow-xl
overflow-hidden
hover:-translate-y-2
transition
"
>


<img
src={
event.banner_url ||
"https://images.unsplash.com/photo-1506157786151-b8491531f063"
}
className="
h-64
w-full
object-cover
"
/>



<div className="p-7">


<h2 className="text-3xl font-black">
{event.title}
</h2>



<p className="mt-4">
📍 {event.venue}, {event.city}
</p>


<p>
📅 {event.event_date}
</p>


<p>
⏰ {event.event_time}
</p>



<p className="
mt-5
text-2xl
font-black
text-purple-700
">
${event.ticket_price}
</p>



<Link

href={`/checkout/${event.id}`}

className="
block
mt-6
text-center
bg-gradient-to-r
from-orange-500
to-purple-700
text-white
py-4
rounded-xl
font-black
"

>

Buy Ticket 🎟

</Link>



</div>



</div>


))

}


</div>



</main>


);

}