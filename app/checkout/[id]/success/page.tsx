"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {

  const { id } = useParams();
  const search = useSearchParams();
  const router = useRouter();


  useEffect(() => {

    async function finishOrder() {


      const qty = Number(search.get("qty") || 1);


      // Get logged in auth user
      const {
        data:{
          user
        }
      } = await supabase.auth.getUser();



      if(!user){
        router.push("/login");
        return;
      }



      // Get user from public users table
      const {
        data:dbUser,
        error:userError
      } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();



      if(userError || !dbUser){

        alert("User profile not found");
        return;

      }




      // Get event

      const {
        data:event
      } = await supabase
      .from("events")
      .select("*")
      .eq("id",id)
      .single();



      if(!event){
        alert("Event not found");
        return;
      }




      // Create order

      const {
        error:orderError
      } = await supabase
      .from("orders")
      .insert({

        user_id: dbUser.id,

        event_id:event.id,

        quantity:qty,

        total_price:
        qty * Number(event.ticket_price)

      });



      if(orderError){

        alert(orderError.message);
        return;

      }





      // Reduce tickets

      await supabase
      .from("events")
      .update({

        tickets_remaining:
        event.tickets_remaining - qty

      })
      .eq(
        "id",
        event.id
      );



    }


    finishOrder();


  },[]);



return (

<main className="
min-h-screen
flex
items-center
justify-center
bg-green-50
">


<div className="
bg-white
rounded-3xl
shadow-xl
p-12
text-center
">


<h1 className="
text-5xl
font-black
text-green-600
">

Payment Successful 🎉

</h1>


<p className="
mt-6
text-xl
">

Your ticket has been created.

</p>


<button

onClick={()=>router.push("/tickets")}

className="
mt-8
bg-purple-700
text-white
px-8
py-4
rounded-xl
font-bold
"

>

View My Tickets

</button>


</div>


</main>


);


}