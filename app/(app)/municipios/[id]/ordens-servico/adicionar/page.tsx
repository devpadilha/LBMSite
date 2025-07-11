import { createClient } from "@/utils/supabase/server";
import { AddServiceOrderForm } from "@/components/municipios/add-service-order-form";

export default async function AddSOPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: employees } = await supabase
    .from('profiles')
    .select('id, name');

  const { data: bids } = await supabase
    .from('bids')
    .select('id, number, object')
    .eq('municipality_id', params.id);

  return (
    <AddServiceOrderForm 
      municipalityId={params.id}
      employees={employees || []}
      bids={bids || []}
    />
  );
}