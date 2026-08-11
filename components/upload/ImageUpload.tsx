"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function ImageUpload({
  setImageUrl,
}:{
  setImageUrl:(url:string)=>void;
}) {


  const [uploading,setUploading] = useState(false);



  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ){

    try {

      setUploading(true);


      const file =
        e.target.files?.[0];


      if(!file) return;



      const fileName =
        `${Date.now()}-${file.name}`;



      const {error} =
        await supabase.storage
        .from("event-images")
        .upload(
          fileName,
          file
        );



      if(error){
        throw error;
      }



      const {data} =
      supabase.storage
      .from("event-images")
      .getPublicUrl(fileName);



      setImageUrl(
        data.publicUrl
      );


      alert("Image uploaded");


    } catch(error){

      alert(
        "Upload failed"
      );

    } finally {

      setUploading(false);

    }

  }



  return (

    <div className="mt-4">


      <label className="block font-semibold mb-2">
        Event Banner
      </label>


      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        className="border p-3 rounded-xl"
      />


      {uploading && (
        <p>
          Uploading...
        </p>
      )}


    </div>

  );

}