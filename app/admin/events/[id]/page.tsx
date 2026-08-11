import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";


export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id:string }>;
}) {


  const {id}=await params;



  const {data:event}=await supabase
  .from("events")
  .select("*")
  .eq("id",id)
  .single();



  if(!event){

    return (
      <div className="p-10">
        Event not found
      </div>
    );

  }



  async function updateEvent(formData:FormData){


    "use server";


    await supabase
    .from("events")
    .update({

      title:formData.get("title"),

      description:formData.get("description"),

      banner_url:formData.get("banner_url"),

      venue:formData.get("venue"),

      city:formData.get("city"),

      country:formData.get("country"),

      ticket_price:formData.get("ticket_price"),

    })
    .eq("id",id);



    redirect("/admin/events");


  }



return (

<div className="p-8">


<h1 className="text-4xl font-bold mb-8">
Edit Event
</h1>



<form
action={updateEvent}
className="bg-white p-8 rounded-2xl shadow-md max-w-3xl"
>


<input
name="title"
defaultValue={event.title}
className="w-full border p-3 rounded-xl mb-4"
/>



<textarea
name="description"
defaultValue={event.description}
className="w-full border p-3 rounded-xl mb-4"
/>



<input
name="banner_url"
defaultValue={event.banner_url}
className="w-full border p-3 rounded-xl mb-4"
/>



<input
name="venue"
defaultValue={event.venue}
className="w-full border p-3 rounded-xl mb-4"
/>



<input
name="city"
defaultValue={event.city}
className="w-full border p-3 rounded-xl mb-4"
/>



<input
name="country"
defaultValue={event.country}
className="w-full border p-3 rounded-xl mb-4"
/>



<input
name="ticket_price"
defaultValue={event.ticket_price}
className="w-full border p-3 rounded-xl mb-4"
/>



<button
className="bg-black text-white px-8 py-3 rounded-xl"
>
Save Changes
</button>



</form>


</div>

);


}