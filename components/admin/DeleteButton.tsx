"use client";

import { useState } from "react";
import { deleteEvent } from "@/lib/actions/deleteEvent";


export default function DeleteButton({
  id,
}: {
  id: string;
}) {


  const [loading, setLoading] = useState(false);



  async function handleDelete() {


    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );


    if (!confirmed) return;



    try {


      setLoading(true);


      await deleteEvent(id);


      window.location.href = "/admin";


    } catch (error) {


      alert(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );


    } finally {


      setLoading(false);


    }


  }




  return (

    <button

      onClick={handleDelete}

      disabled={loading}

      className="bg-red-600 text-white px-4 py-2 rounded-xl"

    >

      {loading ? "Deleting..." : "Delete"}

    </button>

  );

}