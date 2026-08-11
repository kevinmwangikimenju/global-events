"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function DeleteBankButton({
id
}:{
id:string
}){


const router = useRouter();



async function removeBank(){


const confirmDelete =
confirm(
"Delete this bank account?"
);


if(!confirmDelete)
return;



const {
error
}=await supabase

.from("banks")
.delete()
.eq(
"id",
id
);



if(error){

alert(error.message);
return;

}



router.refresh();


}



return (

<button

onClick={removeBank}

className="
bg-red-600
text-white
px-5
py-3
rounded-xl
font-bold
"

>

🗑 Delete

</button>

);


}