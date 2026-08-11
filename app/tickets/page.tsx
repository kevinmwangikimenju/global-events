"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";


export default function TicketsPage() {


const [tickets,setTickets] = useState<any[]>([]);
const [loading,setLoading] = useState(true);



useEffect(()=>{

loadTickets();

},[]);



async function loadTickets(){


try{


const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

setLoading(false);
return;

}





// get user from public users table

const {
data:dbUser

}=await supabase

.from("users")

.select("id")

.eq(
"email",
user.email
)

.single();




if(!dbUser){

console.log("User record missing");

setLoading(false);

return;

}







const {
data,
error

}=await supabase

.from("orders")

.select(`

id,

quantity,

total_price,

created_at,

events(

title,

venue,

city,

country,

banner_url,

event_date,

event_time

)

`)

.eq(
"user_id",
dbUser.id
)

.order(
"created_at",
{
ascending:false
}
);




if(error){

console.log(error);

}



setTickets(data || []);



}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


}







if(loading){

return (

<main className="
min-h-screen
flex
items-center
justify-center
bg-gradient-to-br
from-orange-50
to-purple-100
">


<h1 className="
text-4xl
font-black
">

Loading Tickets...

</h1>


</main>

);

}








return (

<main className="
min-h-screen
bg-gradient-to-br
from-orange-50
via-white
to-purple-100
">



<header className="
bg-white
shadow-md
">


<div className="
max-w-7xl
mx-auto
px-8
py-5
flex
justify-between
items-center
">


<Logo />


<nav className="
flex
gap-8
font-bold
">


<Link href="/dashboard">
Dashboard
</Link>


<Link href="/events">
Events
</Link>


<Link href="/profile">
Profile
</Link>


</nav>


</div>


</header>








<section className="
max-w-7xl
mx-auto
px-8
py-14
">


<h1 className="
text-5xl
font-black
">

🎟 My Tickets

</h1>


<p className="
mt-3
text-gray-600
text-lg
">

Your purchased events and entry passes.

</p>








{
tickets.length === 0 && (

<div className="
mt-12
bg-white
rounded-3xl
shadow-xl
p-14
text-center
">


<div className="text-7xl">
🎫
</div>


<h2 className="
text-4xl
font-black
mt-5
">

No Tickets Yet

</h2>


<p className="
mt-4
text-gray-500
">

Buy an event ticket and it will appear here.

</p>



<Link

href="/events"

className="
inline-block
mt-8
bg-gradient-to-r
from-purple-600
to-orange-500
text-white
px-10
py-4
rounded-2xl
font-black
"

>

Browse Events

</Link>


</div>

)

}








<div className="
grid
lg:grid-cols-2
gap-10
mt-12
">



{

tickets.map((ticket)=>(


<div

key={ticket.id}

className="
bg-white
rounded-3xl
shadow-xl
overflow-hidden
border
"

>


<img

src={
ticket.events?.banner_url ||
"https://images.unsplash.com/photo-1506157786151-b8491531f063"
}

className="
w-full
h-72
object-cover
"

/>



<div className="
p-8
">


<h2 className="
text-4xl
font-black
">

{ticket.events?.title}

</h2>



<div className="
mt-5
space-y-2
text-lg
">


<p>
📍 {ticket.events?.venue}, {ticket.events?.city}
</p>


<p>
🌍 {ticket.events?.country}
</p>


<p>
📅 {ticket.events?.event_date}
</p>


<p>
⏰ {ticket.events?.event_time}
</p>


<p className="
font-black
text-purple-700
">

🎟 Tickets:
{ticket.quantity}

</p>


<p className="
font-black
">

💳 Paid:
${ticket.total_price}

</p>


</div>







<div className="
mt-10
bg-gray-100
rounded-3xl
p-8
flex
flex-col
items-center
">


<QRCodeSVG

value={
`TIXEL-${ticket.id}`
}

size={220}

/>


<h3 className="
mt-6
font-black
text-xl
">

Entry QR Code

</h3>


<p className="
text-gray-500
text-center
mt-3
">

Show this QR code at the entrance.

</p>


<p className="
font-mono
mt-5
">

TIXEL-{ticket.id}

</p>


</div>




</div>


</div>


))

}


</div>



</section>


</main>

);


}