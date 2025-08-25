'use client';

import { useEffect, useState, useRef } from 'react';
import { Download, Save, File, Presentation, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnglish(lessonContent?.englishContent || '');
    setKannada(lessonContent?.kannadaContent || '');
  }, [lessonContent]);

  const handleExportPdf = () => {
    const input = pdfRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;

        let position = 0;
        let heightLeft = height;

        pdf.addImage(imgData, 'PNG', 0, position, width, height);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - height;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, width, height);
          heightLeft -= pdfHeight;
        }
        
        pdf.save('lesson-plan.pdf');
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
            <p className="font-semibold mb-2">Still loading...</p>
            <Skeleton className="h-4 w-3/4" />
          </div>
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

  if (error) {
    return (
       <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="font-headline">Lesson Preview</CardTitle>
          <CardDescription>Your generated lesson will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>There was an error showing the lesson. Failed to fetch.</AlertDescription>
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
        <div ref={pdfRef} className="printable-area p-4 bg-white text-black">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-headline">English Content</h3>
            <Textarea 
              value={english} 
              onChange={(e) => setEnglish(e.target.value)}
              className="h-48 bg-white"
              aria-label="English lesson content"
            />
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-headline">ಕನ್ನಡ ವಿಷಯ</h3>
            <Textarea 
              value={kannada}
              onChange={(e) => setKannada(e.target.value)}
              className="h-48 bg-white"
              aria-label="Kannada lesson content"
            />
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-2">
          <Button><Save /> Save to Library</Button>
          <Button variant="outline" onClick={handleExportPdf}><Download /> Export PDF</Button>
          <Button variant="outline"><Presentation /> Export Slides</Button>
        </div>
      </CardContent>
    </Card>
  );
}
