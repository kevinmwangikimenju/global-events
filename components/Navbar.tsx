"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "./Logo";


export default function Navbar() {

  const [user, setUser] = useState<any>(null);


  useEffect(() => {

    async function checkUser(){

      const {
        data
      } = await supabase.auth.getUser();


      setUser(data.user);

    }


    checkUser();


    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setUser(session?.user ?? null);

      }
    );


    return () => {

      listener.subscription.unsubscribe();

    };


  }, []);





  async function logout(){

    await supabase.auth.signOut();

    window.location.href="/";

  }





  return (

    <nav className="
    bg-white
    shadow-md
    sticky
    top-0
    z-50
    ">


      <div className="
      max-w-7xl
      mx-auto
      px-6
      py-4
      flex
      items-center
      justify-between
      ">


        {/* LOGO */}

        <Link href="/">

          <Logo />

        </Link>





        {/* NAVIGATION */}

        <div className="
        flex
        items-center
        gap-6
        ">


          <Link
          href="/"
          className="
          font-medium
          text-gray-700
          hover:text-purple-600
          transition
          "
          >
            Home
          </Link>





          <Link
          href="/events"
          className="
          font-medium
          text-gray-700
          hover:text-purple-600
          transition
          "
          >
            Events
          </Link>





          {
          user ? (

            <>


              <Link

              href="/tickets"

              className="
              font-medium
              text-gray-700
              hover:text-purple-600
              "

              >

                My Tickets

              </Link>





              <button

              onClick={logout}

              className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-6
              py-2
              rounded-full
              font-semibold
              transition
              "

              >

                Logout

              </button>



            </>


          ) : (

            <>


              <Link

              href="/login"

              className="
              border-2
              border-purple-600
              text-purple-600
              px-6
              py-2
              rounded-full
              font-semibold
              hover:bg-purple-600
              hover:text-white
              transition
              "

              >

                Login

              </Link>





              <Link

              href="/register"

              className="
              bg-gradient-to-r
              from-orange-500
              via-pink-500
              to-purple-600
              text-white
              px-6
              py-2
              rounded-full
              font-semibold
              shadow-lg
              hover:scale-105
              transition
              "

              >

                Register

              </Link>



            </>


          )}



        </div>



      </div>



    </nav>

  );

}