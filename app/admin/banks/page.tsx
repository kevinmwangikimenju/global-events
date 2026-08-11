import { supabase } from "@/lib/supabase";
import AddBankForm from "@/components/admin/AddBankForm";
import DeleteBankButton from "@/components/admin/DeleteBankButton";
import Link from "next/link";

export const dynamic = "force-dynamic";


export default async function BanksPage(){


const {
  data:banks,
  error
}=await supabase

.from("banks")
.select("*")
.order(
"created_at",
{
ascending:false
}
);



return (

<main className="
min-h-screen
bg-gray-100
p-8
">


<div className="
max-w-7xl
mx-auto
">



{/* HEADER */}

<div className="
bg-gradient-to-r
from-purple-700
via-purple-600
to-orange-500
text-white
rounded-3xl
p-10
shadow-2xl
flex
justify-between
items-center
flex-wrap
gap-5
">


<div>

<h1 className="
text-5xl
font-black
">

🏦 Payment Banks

</h1>


<p className="
mt-3
text-xl
">

Manage Australian bank transfer payment accounts

</p>


</div>



<Link

href="/admin/dashboard"

className="
bg-white
text-purple-700
px-6
py-3
rounded-xl
font-black
"

>

← Dashboard

</Link>


</div>





{/* ERROR */}

{
error &&

<div className="
mt-8
bg-red-100
text-red-700
p-5
rounded-2xl
font-bold
">

{error.message}

</div>

}





{/* ADD BANK */}


<div className="
mt-10
">

<AddBankForm />

</div>







{/* BANK LIST */}



{

!banks || banks.length===0

?

<div className="
mt-10
bg-white
rounded-3xl
shadow-xl
p-14
text-center
">


<div className="
text-6xl
">

🏦

</div>


<h2 className="
text-3xl
font-black
mt-5
">

No Banks Added

</h2>


<p className="
text-gray-500
mt-3
">

Add your first Australian bank account above.

</p>


</div>



:


<div className="
grid
md:grid-cols-2
gap-8
mt-10
">


{

banks.map((bank)=>(


<div

key={bank.id}

className="
bg-white
rounded-3xl
shadow-xl
p-8
border
hover:-translate-y-2
transition
"

>



<div className="
flex
justify-between
items-start
">


<h2 className="
text-3xl
font-black
">

{bank.bank_name}

</h2>



{

bank.active

?

<span className="
bg-green-100
text-green-700
px-4
py-2
rounded-full
font-bold
">

ACTIVE

</span>


:

<span className="
bg-red-100
text-red-700
px-4
py-2
rounded-full
font-bold
">

CLOSED

</span>


}


</div>







<div className="
mt-8
space-y-4
text-lg
">


<p>

👤

<b>
Account Name:
</b>

<br/>

{bank.account_name}

</p>





<p>

🏦

<b>
BSB:
</b>

<br/>

{bank.bsb}

</p>





<p>

💳

<b>
Account Number:
</b>

<br/>

{bank.account_number}

</p>






<p>

📱

<b>
PayID:
</b>

<br/>

{

bank.payid ||

"No PayID added"

}

</p>





{

bank.instructions &&

<p>

📝

<b>
Instructions:
</b>

<br/>

{bank.instructions}

</p>

}



</div>







<div className="
flex
gap-4
mt-8
">


<DeleteBankButton

id={bank.id}

/>



</div>





</div>


))

}


</div>


}



</div>


</main>

);


}