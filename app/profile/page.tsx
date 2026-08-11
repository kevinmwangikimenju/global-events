"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Logo from "@/components/Logo";


export default function ProfilePage(){

const [user,setUser] = useState<any>(null);
const [tickets,setTickets] = useState(0);



useEffect(()=>{

loadProfile();

},[]);



async function loadProfile(){

const {
data:{
user
}
}=await supabase.auth.getUser();



if(user){

setUser(user);


const {count}=await supabase
.from("orders")
.select("*",{count:"exact",head:true})
.eq(
"user_id",
user.id
);


setTickets(count || 0);

}

}





const name =
user?.user_metadata?.full_name ||
user?.email?.split("@")[0] ||
"Guest";



const initials =
name
.split(" ")
.map((x:string)=>x[0])
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
bg-white
shadow-lg
sticky
top-0
z-50
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


<Link href="/tickets">
Tickets
</Link>


</nav>


</div>

</header>






<section className="
max-w-5xl
mx-auto
px-8
py-16
">


<div className="
bg-white
rounded-[40px]
shadow-2xl
overflow-hidden
">


{/* COVER */}

<div className="
h-56
bg-gradient-to-r
from-purple-700
via-pink-500
to-orange-500
">
</div>





<div className="
px-10
pb-12
">


{/* AVATAR */}

<div className="
-mt-20
w-40
h-40
rounded-full
bg-white
shadow-xl
flex
items-center
justify-center
text-5xl
font-black
text-purple-700
border-8
border-white
">


{initials}


</div>





<h1 className="
text-5xl
font-black
mt-8
">

{name} 👋

</h1>


<p className="
text-gray-500
text-lg
mt-3
">

Welcome to your Tixel account.

</p>







{/* INFO CARDS */}


<div className="
grid
md:grid-cols-3
gap-6
mt-12
">



<div className="
bg-purple-100
rounded-3xl
p-7
">

<p className="
text-gray-600
">

Email

</p>


<h2 className="
font-bold
mt-3
break-all
">

{user?.email || "Loading..."}

</h2>


</div>






<div className="
bg-orange-100
rounded-3xl
p-7
">


<p className="
text-gray-600
">

Tickets Purchased

</p>


<h2 className="
text-5xl
font-black
mt-3
text-orange-600
">

{tickets}

</h2>


</div>






<div className="
bg-pink-100
rounded-3xl
p-7
">


<p className="
text-gray-600
">

Member Status

</p>


<h2 className="
text-2xl
font-black
mt-3
text-green-600
">

✓ Active

</h2>


</div>



</div>







{/* ACTIONS */}


<div className="
grid
md:grid-cols-3
gap-6
mt-12
">


<Link

href="/tickets"

className="
bg-gradient-to-r
from-purple-700
to-pink-500
text-white
rounded-3xl
p-7
text-center
font-black
text-xl
hover:scale-105
transition
"

>

🎟 My Tickets

</Link>





<Link

href="/events"

className="
bg-gradient-to-r
from-orange-500
to-yellow-400
text-white
rounded-3xl
p-7
text-center
font-black
text-xl
hover:scale-105
transition
"

>

🎤 Browse Events

</Link>





<Link

href="/dashboard"

className="
bg-black
text-white
rounded-3xl
p-7
text-center
font-black
text-xl
hover:scale-105
transition
"

>

🏠 Dashboard

</Link>




</div>




</div>


</div>


</section>


</main>


);


}