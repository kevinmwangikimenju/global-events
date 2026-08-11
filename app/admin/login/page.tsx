"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function AdminLogin() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);



  async function loginAdmin(e:any){

    e.preventDefault();

    setLoading(true);
    setError("");



    // Login with Supabase Auth

    const {
      data,
      error:loginError

    } = await supabase.auth.signInWithPassword({

      email,
      password

    });



    if(loginError){

      setError("Invalid email or password");
      setLoading(false);
      return;

    }



    const user = data.user;



    // Check admins table

    const {
      data:admin,
      error:adminError

    } = await supabase

      .from("admins")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();



    if(adminError){

      setError(
        "Database error checking admin"
      );

      setLoading(false);
      return;

    }



    if(!admin){

      await supabase.auth.signOut();

      setError(
        "You are not an administrator"
      );

      setLoading(false);
      return;

    }



    // Admin accepted

    router.push("/admin");


  }





  return (

    <main className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gradient-to-br
    from-blue-600
    via-purple-600
    to-pink-500
    p-6
    ">


      <div className="
      bg-white
      rounded-3xl
      shadow-2xl
      p-10
      w-full
      max-w-md
      ">


        <div className="text-center">


          <div className="
          text-5xl
          mb-4
          ">
          🔐
          </div>


          <h1 className="
          text-3xl
          font-bold
          ">
          Admin Portal
          </h1>


          <p className="
          text-gray-500
          mt-2
          ">
          Global Events Management
          </p>


        </div>





        <form
        onSubmit={loginAdmin}
        className="mt-8 space-y-5"
        >



          <div>

            <label className="
            text-sm
            font-semibold
            ">
            Email
            </label>


            <input

            type="email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            outline-none
            focus:ring-2
            focus:ring-purple-500
            "

            placeholder="admin@email.com"

            required

            />

          </div>





          <div>

            <label className="
            text-sm
            font-semibold
            ">
            Password
            </label>


            <input

            type="password"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            outline-none
            focus:ring-2
            focus:ring-purple-500
            "

            placeholder="********"

            required

            />

          </div>





          {
            error &&

            <div className="
            bg-red-100
            text-red-600
            p-3
            rounded-xl
            text-center
            ">

              {error}

            </div>

          }





          <button

          disabled={loading}

          className="
          w-full
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          py-3
          rounded-xl
          font-bold
          hover:opacity-90
          "

          >

          {
            loading
            ?
            "Checking..."
            :
            "Login as Admin"
          }

          </button>



        </form>



      </div>



    </main>

  );

}