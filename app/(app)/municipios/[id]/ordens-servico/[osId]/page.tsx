// app/municipios/[id]/ordens-servico/[osId]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getServiceOrderById } from "@/app/actions/soActions";
import { ServiceOrderDetail } from "@/components/municipios/service-order-detail";

export default async function OrdemServicoPage({ params }: { params: { osId: string } }) {
  
  // Busca a OS específica com seus funcionários já associados
  const serviceOrder = await getServiceOrderById(params.osId);

  // Busca TODOS os funcionários para popular o seletor de edição
  const supabase = createClient();
  const { data: allEmployees } = await supabase
    .from('profiles')
    .select('id, name');

  if (!serviceOrder) {
    notFound();
  }
  
  // Passa os dados para o componente de cliente que cuidará da UI
  return (
    <ServiceOrderDetail 
      initialServiceOrder={serviceOrder} 
      allEmployees={allEmployees || []} 
    />
  );
}