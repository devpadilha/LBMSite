"use client";

import { Activity, Bell, Lock } from "lucide-react";

import { ProfileActivity } from "@/components/profile/profile-activity";
import { ProfileNotifications } from "@/components/profile/profile-notifications";
import { ProfileSecurity } from "@/components/profile/profile-security";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileTabs() {
  return (
    <Tabs defaultValue="activity" className="space-y-4">
      <TabsList className="bg-muted/60 border">
        <TabsTrigger value="activity" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
          <Activity className="h-4 w-4 mr-2" />
          Atividade
        </TabsTrigger>
        <TabsTrigger value="security" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
          <Lock className="h-4 w-4 mr-2" />
          Segurança
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notificações
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="space-y-4">
        <ProfileActivity />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <ProfileSecurity />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <ProfileNotifications />
      </TabsContent>
    </Tabs>
  );
}
