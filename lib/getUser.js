import { supabase } from "./supabase";

export async function getUser() {

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
    return null;
  }

  return user;
}