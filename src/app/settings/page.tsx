import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Settings</CardTitle>
          <CardDescription>
            Manage your application preferences here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
            <Settings className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold font-headline mb-2">Coming Soon!</h3>
            <p>We're preparing the settings page for you to customize your experience.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
