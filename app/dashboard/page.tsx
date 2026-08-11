"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {

  const [userName,setUserName] = useState("Guest");
  const [events,setEvents] = useState<any[]>([]);


  useEffect(()=>{
    loadDashboard();
  },[]);



  async function loadDashboard(){

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(user){

      setUserName(
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Guest"
      );

    }



    const {
      data
    } = await supabase
    .from("events")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    )
    .limit(6);



    setEvents(data || []);

  }



  const initials =
  userName
  .split(" ")
  .map(
    word=>word[0]
  )
  .join("")
  .slice(0,2)
  .toUpperCase();



return (

<main className="
min-h-screen
bg-gradient-to-br
from-orange-50
via-white
to-purple-100
">



{/* NAVBAR */}

<header className="
bg-white/90
backdrop-blur
shadow-md
sticky
top-0
z-50
">


<div className="
max-w-7xl
mx-auto
px-6
py-5
flex
justify-between
items-center
">


<Logo />



<nav className="
flex
gap-5
md:gap-8
font-bold
text-gray-700
">


<Link href="/events">
Events
</Link>


<Link href="/tickets">
My Tickets
</Link>


<Link href="/profile">
Profile
</Link>


</nav>


</div>


</header>





{/* HERO */}


<section className="
relative
overflow-hidden
bg-gradient-to-r
from-purple-700
via-pink-600
to-orange-500
">


<div className="
max-w-7xl
mx-auto
px-6
py-20
text-white
">


<p className="
text-lg
opacity-90
">
Welcome back 👋
</p>



<h1 className="
text-5xl
md:text-6xl
font-black
mt-3
">

{userName}

</h1>



<p className="
mt-5
text-xl
max-w-2xl
">

Discover concerts, festivals and unforgettable experiences created by our event partners.

</p>



<div className="
flex
gap-5
mt-10
flex-wrap
">


<Link
href="/events"
className="
bg-white
text-purple-700
px-8
py-4
rounded-2xl
font-black
shadow-xl
hover:scale-105
transition
"
>

🎤 Browse Events

</Link>



<Link
href="/tickets"
className="
border-2
border-white
px-8
py-4
rounded-2xl
font-black
hover:bg-white
hover:text-purple-700
transition
"
>

🎟 My Tickets

</Link>


</div>



</div>


</section>







{/* PROFILE + STATS */}



<section className="
max-w-7xl
mx-auto
px-6
py-12
grid
md:grid-cols-3
gap-8
">



<div className="
bg-white
rounded-3xl
shadow-xl
p-8
text-center
">


<div className="
w-28
h-28
mx-auto
rounded-full
bg-gradient-to-br
from-purple-600
to-orange-500
flex
items-center
justify-center
text-white
text-4xl
font-black
">

{initials}

</div>



<h2 className="
text-3xl
font-black
mt-5
">

{userName}

</h2>



<p className="
text-green-600
font-bold
mt-3
">

✓ Verified Member

</p>



</div>




<div className="
bg-gradient-to-br
from-purple-600
to-pink-500
text-white
rounded-3xl
shadow-xl
p-8
">

<h3 className="
text-xl
font-bold
">

Available Events

</h3>


<p className="
text-6xl
font-black
mt-5
">

{events.length}

</p>

</div>





<div className="
bg-gradient-to-br
from-orange-500
to-yellow-400
text-white
rounded-3xl
shadow-xl
p-8
">

<h3 className="
text-xl
font-bold
">

Your Experience

</h3>


<p className="
text-3xl
font-black
mt-5
">

Premium User

</p>


</div>



</section>







{/* EVENTS */}



<section className="
max-w-7xl
mx-auto
px-6
pb-20
">


<div className="
flex
justify-between
items-center
mb-8
">


<h2 className="
text-4xl
font-black
">

Trending Events 🔥

</h2>



<Link
href="/events"
className="
bg-purple-700
text-white
px-6
py-3
rounded-xl
font-bold
"
>

View All

</Link>


</div>






<div className="
grid
md:grid-cols-3
gap-8
">



{
events.map(event=>(


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
h-56
w-full
object-cover
"

/>



<div className="
p-6
">


<h3 className="
text-2xl
font-black
">

{event.title}

</h3>



<p className="
mt-3
text-gray-600
">

📍 {event.city}

</p>



<p className="
font-black
text-purple-700
mt-3
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
py-3
rounded-xl
font-black
"
>

Buy Ticket

</Link>


</div>


</div>


))

}


</div>


</section>


</main>


);


}