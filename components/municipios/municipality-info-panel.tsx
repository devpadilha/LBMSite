import { Building, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/types/database.types"; // Seus tipos do Supabase

type MunicipalityInfoPanelProps = {
  municipality: Tables<'municipalities'>;
};

export function MunicipalityInfoPanel({ municipality }: MunicipalityInfoPanelProps) {
  const googleMapsUrl = municipality.latitude && municipality.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${municipality.latitude},${municipality.longitude}`
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-[#EC610D]/10 p-3 rounded-lg">
            <Building className="h-6 w-6 text-[#EC610D]" />
          </div>
          <div>
            <CardTitle>{municipality.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{municipality.state}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{municipality.mayor || "Prefeito não informado"}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{municipality.phone || "Telefone não informado"}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${municipality.email}`} className="truncate hover:underline">
            {municipality.email || "E-mail não informado"}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <a href={municipality.official_site || '#'} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
            {municipality.official_site || "Site não informado"}
          </a>
        </div>
        {googleMapsUrl && (
          <Button asChild variant="outline" className="w-full mt-4">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 h-4 w-4" />
              Ver no Mapa
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}