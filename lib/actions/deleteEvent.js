"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";


export async function deleteEvent(eventId) {

  console.log("DELETE START:", eventId);


  // Find orders connected to event

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("event_id", eventId);


  if (ordersError) {
    throw new Error(
      "Finding orders failed: " + ordersError.message
    );
  }


  const orderIds = orders?.map(
    (order) => order.id
  ) || [];



  // Delete payments first

  if (orderIds.length > 0) {

    const { error } = await supabase
      .from("payments")
      .delete()
      .in("order_id", orderIds);


    if (error) {
      throw new Error(
        "Payments delete failed: " + error.message
      );
    }

  }



  // Delete tickets linked to event

  const { error: eventTicketsError } = await supabase
    .from("tickets")
    .delete()
    .eq("event_id", eventId);


  if (eventTicketsError) {
    throw new Error(
      "Event tickets delete failed: " + eventTicketsError.message
    );
  }




  // Delete tickets linked to orders

  if (orderIds.length > 0) {

    const { error } = await supabase
      .from("tickets")
      .delete()
      .in("order_id", orderIds);


    if (error) {
      throw new Error(
        "Order tickets delete failed: " + error.message
      );
    }

  }





  // Delete orders

  if (orderIds.length > 0) {

    const { error } = await supabase
      .from("orders")
      .delete()
      .in("id", orderIds);


    if (error) {
      throw new Error(
        "Orders delete failed: " + error.message
      );
    }

  }




  // Delete event

  const { data: deletedEvent, error: deleteError } =
    await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .select();



  console.log("DELETE RESULT:", deletedEvent);
  console.log("DELETE ERROR:", deleteError);



  if (deleteError) {

    throw new Error(
      "Event delete failed: " + deleteError.message
    );

  }



  if (!deletedEvent || deletedEvent.length === 0) {

    throw new Error(
      "No event deleted. Check Supabase permissions."
    );

  }



  revalidatePath("/admin", "page");


  return true;

}