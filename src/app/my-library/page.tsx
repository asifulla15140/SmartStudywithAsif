import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function MyLibraryPage() {
  return (
    <div className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Library</CardTitle>
          <CardDescription>
            All your saved lessons will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
            <Library className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold font-headline mb-2">Coming Soon!</h3>
            <p>We're working hard to bring you a personal library to save and manage your lessons.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
