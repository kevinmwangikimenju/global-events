import { supabase } from "@/lib/supabase";

export default async function TestSupabase() {

  const { data: events, error } = await supabase
    .from("events")
    .select("*");

  return (
    <div style={{ padding: "30px" }}>
      <h1>Supabase Test</h1>

      <pre>
        {JSON.stringify(
          {
            error,
            count: events?.length,
            events,
          },
          null,
          2
        )}
      </pre>
    </div>
  );

}