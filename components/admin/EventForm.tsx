"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EventForm() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);



  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    try {

      const file = e.target.files?.[0];

      if (!file) return;


      setUploading(true);



      const fileName =
        `${Date.now()}-${file.name}`;



      const { error } =
        await supabase.storage
          .from("event-images")
          .upload(
            fileName,
            file
          );



      if(error){

        alert(error.message);
        return;

      }



      const { data } =
        supabase.storage
          .from("event-images")
          .getPublicUrl(fileName);



      setBannerUrl(
        data.publicUrl
      );



      alert("Image uploaded successfully");


    } catch(error:any){

      alert(error.message);

    }
    finally{

      setUploading(false);

    }

  }




  async function handleSubmit(
    e:React.FormEvent
  ){

    e.preventDefault();

    setLoading(true);


    try {


      const {
        data:{user}
      } = await supabase.auth.getUser();



      if(!user){

        alert("You must login first");
        return;

      }




      const {error}=await supabase
      .from("events")
      .insert({

        title,

        description,

        banner_url:bannerUrl,

        category,

        venue,

        city,

        country,

        event_date:date,

        event_time:time,

        ticket_price:Number(price),

        ticket_quantity:Number(quantity),

        tickets_remaining:Number(quantity),

        status:"published",

        created_by:user.id

      });



      if(error){

        alert(error.message);
        return;

      }



      alert("Event published successfully");



      setTitle("");
      setDescription("");
      setBannerUrl("");
      setCategory("");
      setVenue("");
      setCity("");
      setCountry("");
      setDate("");
      setTime("");
      setPrice("");
      setQuantity("");



    }
    catch(error:any){

      alert(error.message);

    }
    finally{

      setLoading(false);

    }

  }




return (

<form
onSubmit={handleSubmit}
className="bg-white p-8 rounded-2xl shadow-md max-w-3xl"
>



<input
className="w-full border p-3 rounded-xl mb-4"
placeholder="Event title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>



<textarea
className="w-full border p-3 rounded-xl mb-4"
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>



<label className="block font-semibold mb-2">
Event Banner Image
</label>


<input
type="file"
accept="image/*"
onChange={uploadImage}
className="w-full border p-3 rounded-xl mb-3"
/>


{uploading && (
<p className="text-blue-600 mb-3">
Uploading image...
</p>
)}



{bannerUrl && (

<img
src={bannerUrl}
alt="preview"
className="w-full h-48 object-cover rounded-xl mb-4"
/>

)}




<input
className="w-full border p-3 rounded-xl mb-4"
placeholder="Category"
value={category}
onChange={(e)=>setCategory(e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-4"
placeholder="Venue"
value={venue}
onChange={(e)=>setVenue(e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-4"
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
/>



<input
className="w-full border p-3 rounded-xl mb-4"
placeholder="Country"
value={country}
onChange={(e)=>setCountry(e.target.value)}
/>



<input
type="date"
className="w-full border p-3 rounded-xl mb-4"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>



<input
type="time"
className="w-full border p-3 rounded-xl mb-4"
value={time}
onChange={(e)=>setTime(e.target.value)}
/>



<input
type="number"
className="w-full border p-3 rounded-xl mb-4"
placeholder="Ticket price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>



<input
type="number"
className="w-full border p-3 rounded-xl mb-4"
placeholder="Ticket quantity"
value={quantity}
onChange={(e)=>setQuantity(e.target.value)}
/>




<button
type="submit"
disabled={loading}
className="bg-black text-white px-8 py-3 rounded-xl"
>

{loading ? "Publishing..." : "Publish Event"}

</button>



</form>

);


}