"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase";


export default function AddBankForm(){

const [bank,setBank]=useState("");
const [account,setAccount]=useState("");
const [bsb,setBsb]=useState("");
const [number,setNumber]=useState("");
const [payid,setPayid]=useState("");

const [loading,setLoading]=useState(false);



async function addBank(){

setLoading(true);


const {error}=await supabase
.from("banks")
.insert({

bank_name:bank,

account_name:account,

bsb:bsb,

account_number:number,

payid:payid,

active:true

});


setLoading(false);


if(error){

alert(error.message);
return;

}


alert("Bank Added Successfully");

location.reload();


}



return (

<div className="bg-white rounded-3xl shadow-xl p-8">


<h2 className="text-3xl font-black mb-6">
Add Australian Bank Account
</h2>



<input

className="border p-4 rounded-xl w-full mb-4"

placeholder="Bank Name"

onChange={
e=>setBank(e.target.value)
}

/>



<input

className="border p-4 rounded-xl w-full mb-4"

placeholder="Account Name"

onChange={
e=>setAccount(e.target.value)
}

/>



<input

className="border p-4 rounded-xl w-full mb-4"

placeholder="BSB"

onChange={
e=>setBsb(e.target.value)
}

/>



<input

className="border p-4 rounded-xl w-full mb-4"

placeholder="Account Number"

onChange={
e=>setNumber(e.target.value)
}

/>



<input

className="border p-4 rounded-xl w-full mb-4"

placeholder="PayID (optional)"

onChange={
e=>setPayid(e.target.value)
}

/>




<button

onClick={addBank}

disabled={loading}

className="
bg-gradient-to-r
from-purple-700
to-orange-500
text-white
px-8
py-4
rounded-xl
font-black
"

>

{
loading
?
"Adding..."
:
"Add Bank"
}


</button>


</div>


)

}