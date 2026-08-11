import { supabase } from "../supabase";


export async function purchaseTicket(eventId, quantity) {

  // Get current logged-in user
  const {
    data: sessionData
  } = await supabase.auth.getSession();


  const sessionUser = sessionData.session?.user;


  if (!sessionUser) {
    return {
      error: "No active login session. Please login again."
    };
  }



  // Find user profile in public.users
  const {
    data: profile,
    error: profileError
  } = await supabase
    .from("users")
    .select("id")
    .or(
      `auth_id.eq.${sessionUser.id},email.eq.${sessionUser.email}`
    )
    .single();



  if (profileError || !profile) {

    console.log("AUTH USER:", sessionUser);
    console.log("PROFILE ERROR:", profileError);

    return {
      error: "User profile not found"
    };

  }




  // Get event information
  const {
    data: event,
    error: eventError
  } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();



  if (eventError || !event) {

    return {
      error: "Event not found"
    };

  }




  const totalAmount =
    Number(event.ticket_price) * Number(quantity);




  // Create order
  const {
    data: order,
    error: orderError
  } = await supabase
    .from("orders")
    .insert({

      user_id: profile.id,

      event_id: event.id,

      quantity: quantity,

      total_amount: totalAmount,

      payment_status: "pending"

    })
    .select()
    .single();




  if (orderError) {

    return {
      error: orderError.message
    };

  }




  // Create tickets
  const ticketRows = [];


  for (let i = 0; i < quantity; i++) {

    ticketRows.push({

      order_id: order.id,

      user_id: profile.id,

      event_id: event.id,

      qr_code: crypto.randomUUID(),

      status: "valid"

    });

  }




  const {
    error: ticketError
  } = await supabase
    .from("tickets")
    .insert(ticketRows);




  if (ticketError) {

    return {
      error: ticketError.message
    };

  }




  return {

    success: true,

    orderId: order.id

  };

}