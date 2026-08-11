"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function PaymentPage(){

const params = useParams();

const eventId = String(params.id);

const searchParams = useSearchParams();

const router = useRouter();


const qty = Number(searchParams.get("qty") || 1);



const [banks,setBanks] = useState<any[]>([]);

const [selectedBank,setSelectedBank] = useState("");

const [paymentId,setPaymentId] = useState("");

const [amount,setAmount] = useState("");

const [file,setFile] = useState<File | null>(null);

const [loading,setLoading] = useState(false);



useEffect(()=>{

fetchBanks();

},[]);




async function fetchBanks(){


const {
data,
error
}=await supabase

.from("banks")

.select("*")

.eq("active",true);



if(error){

console.log(error.message);

return;

}


setBanks(data || []);

}





async function submitPayment(){


if(!selectedBank){

alert("Please select a bank");

return;

}


if(!paymentId.trim()){

alert("Enter Payment ID");

return;

}


if(!amount){

alert("Enter amount paid");

return;

}


if(!file){

alert("Upload payment screenshot");

return;

}



setLoading(true);





const {
data:{
user
}

}=await supabase.auth.getUser();




if(!user){

alert("Please login first");

setLoading(false);

return;

}





// upload screenshot

const fileName =
`${Date.now()}-${file.name.replace(/\s/g,"-")}`;



const {
error:uploadError
}=await supabase.storage

.from("payment-proofs")

.upload(
fileName,
file,
{
cacheControl:"3600",
upsert:false
}
);




if(uploadError){

alert(uploadError.message);

setLoading(false);

return;

}




const {
data:urlData
}=supabase.storage

.from("payment-proofs")

.getPublicUrl(fileName);







const {
error:insertError
}=await supabase

.from("payments")

.insert({

user_id:user.id,

event_id:eventId,

bank_id:selectedBank,

payment_id:paymentId,

amount:Number(amount),

proof_url:urlData.publicUrl,

status:"pending"

});





if(insertError){

alert(insertError.message);

setLoading(false);

return;

}





alert(
"Payment proof submitted successfully. Waiting for admin approval."
);



router.push("/tickets");



}





return (

<main className="
min-h-screen
bg-gradient-to-br
from-orange-50
via-white
to-purple-100
p-8
">


<div className="
max-w-4xl
mx-auto
bg-white
rounded-3xl
shadow-xl
p-10
">


<h1 className="
text-5xl
font-black
">

Australian Bank Transfer

</h1>


<p className="
mt-3
text-gray-600
text-lg
">

Transfer payment and upload your receipt.

</p>





<h2 className="
text-3xl
font-black
mt-10
">

Select Bank

</h2>




<div className="
grid
md:grid-cols-2
gap-6
mt-6
">


{
banks.map(bank=>(


<div

key={bank.id}

onClick={()=>setSelectedBank(bank.id)}

className={`

cursor-pointer
rounded-3xl
p-6
border-2

${
selectedBank===bank.id
?
"border-purple-700 bg-purple-50"
:
"border-gray-200"
}

`}

>


<h3 className="
text-2xl
font-black
">

{bank.bank_name}

</h3>


<p className="mt-4">
<b>Account Name:</b> {bank.account_name}
</p>


<p>
<b>BSB:</b> {bank.bsb}
</p>


<p>
<b>ACC:</b> {bank.account_number}
</p>


{
bank.payid &&

<p>
<b>PAYID:</b> {bank.payid}
</p>

}



{
selectedBank===bank.id &&

<p className="
mt-4
text-purple-700
font-black
">

✓ Selected

</p>

}



</div>


))

}


</div>







<div className="
mt-10
">


<input

placeholder="Payment ID / Reference"

value={paymentId}

onChange={(e)=>setPaymentId(e.target.value)}

className="
w-full
border
rounded-xl
p-4
mb-4
"

/>





<input

placeholder="Amount Paid"

type="number"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

className="
w-full
border
rounded-xl
p-4
mb-4
"

/>






<label className="
font-bold
block
mb-2
">

Upload Payment Screenshot

</label>





<input

type="file"

accept="image/*"

onChange={(e)=>{

const selected =
e.target.files?.[0];


if(selected){

setFile(selected);

}

}}

/>



{
file &&

<p className="
mt-3
text-green-600
font-bold
">

Uploaded: {file.name}

</p>

}





<button

disabled={loading}

onClick={submitPayment}

className="
mt-8
w-full
py-5
rounded-2xl
bg-gradient-to-r
from-purple-700
to-orange-500
text-white
font-black
text-xl
"

>


{
loading
?
"Submitting..."
:
"Submit Payment Proof"
}


</button>



</div>



</div>


</main>

);

}