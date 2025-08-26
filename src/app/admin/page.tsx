"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Admin Panel</CardTitle>
          <CardDescription>
            Manage your application from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
            <Shield className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold font-headline mb-2">Welcome, Admin!</h3>
            <p>This is your control center. More admin features are coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
