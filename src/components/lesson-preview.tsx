'use client';

import { useEffect, useState } from 'react';
import { Download, Save, File, Presentation } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import type { LessonContent } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LessonPreviewProps {
  lessonContent: LessonContent | null;
  isLoading: boolean;
  error: string | null;
}

export function LessonPreview({ lessonContent, isLoading, error }: LessonPreviewProps) {
  const [english, setEnglish] = useState('');
  const [kannada, setKannada] = useState('');

  useEffect(() => {
    setEnglish(lessonContent?.englishContent || '');
    setKannada(lessonContent?.kannadaContent || '');
  }, [lessonContent]);

  if (isLoading) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !lessonContent) {
    return (
       <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="font-headline">Lesson Preview</CardTitle>
          <CardDescription>Your generated lesson will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!lessonContent) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="font-headline">Lesson Preview</CardTitle>
          <CardDescription>Your generated lesson will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
            <File className="h-12 w-12 mb-4" />
            <p>Generate a lesson to see the preview.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="font-headline">Generated Lesson</CardTitle>
        <CardDescription>Review and edit the content below. You can save or export it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold font-headline">English Content</h3>
          <Textarea 
            value={english} 
            onChange={(e) => setEnglish(e.target.value)}
            className="h-48 bg-white"
            aria-label="English lesson content"
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold font-headline">ಕನ್ನಡ ವಿಷಯ</h3>
          <Textarea 
            value={kannada}
            onChange={(e) => setKannada(e.target.value)}
            className="h-48 bg-white"
            aria-label="Kannada lesson content"
          />
        </div>
        <Separator />
        <div className="flex flex-wrap gap-2">
          <Button><Save /> Save to Library</Button>
          <Button variant="outline"><Download /> Export PDF</Button>
          <Button variant="outline"><Presentation /> Export Slides</Button>
        </div>
      </CardContent>
    </Card>
  );
}
