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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface LessonPreviewProps {
  lessonContent: LessonContent | null;
  isLoading: boolean;
  error: string | null;
}

export function LessonPreview({ lessonContent, isLoading, error }: LessonPreviewProps) {
  const [english, setEnglish] = useState('');
  const [kannada, setKannada] = useState('');
  const [questionPaperEnglish, setQuestionPaperEnglish] = useState('');
  const [answerKeyEnglish, setAnswerKeyEnglish] = useState('');
  const [questionPaperKannada, setQuestionPaperKannada] = useState('');
  const [answerKeyKannada, setAnswerKeyKannada] = useState('');
  const [accordionValues, setAccordionValues] = useState<string[]>([]);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);


  useEffect(() => {
    setEnglish(lessonContent?.englishContent || '');
    setKannada(lessonContent?.kannadaContent || '');
    setQuestionPaperEnglish(lessonContent?.questionPaperEnglish || '');
    setAnswerKeyEnglish(lessonContent?.answerKeyEnglish || '');
    setQuestionPaperKannada(lessonContent?.questionPaperKannada || '');
    setAnswerKeyKannada(lessonContent?.answerKeyKannada || '');
  }, [lessonContent]);

  const handleExportPdf = async () => {
    const input = pdfRef.current;
    if (!input || !lessonContent) return;

    setIsExporting(true);

    // Open all accordions
    const allAccordionValues = ['qp-en', 'ak-en', 'qp-kn', 'ak-kn'].filter(val => {
      switch (val) {
        case 'qp-en': return !!lessonContent.questionPaperEnglish;
        case 'ak-en': return !!lessonContent.answerKeyEnglish;
        case 'qp-kn': return !!lessonContent.questionPaperKannada;
        case 'ak-kn': return !!lessonContent.answerKeyKannada;
        default: return false;
      }
    });
    setAccordionValues(allAccordionValues);

    // Wait for accordions to render open
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            // Allow tainting to handle potential cross-origin images, if any.
            allowTaint: true, 
            onclone: (document) => {
              // On clone, find all textareas and replace them with divs
              // This is because html2canvas has trouble with textarea content.
              Array.from(document.querySelectorAll('textarea')).forEach(textArea => {
                  const div = document.createElement('div');
                  div.style.width = `${textArea.offsetWidth}px`;
                  div.style.height = `${textArea.offsetHeight}px`;
                  div.style.border = '1px solid #ccc';
                  div.style.borderRadius = '0.375rem';
                  div.style.padding = '0.5rem';
                  div.style.whiteSpace = 'pre-wrap';
                  div.style.wordWrap = 'break-word';
                  div.style.fontSize = '14px';
                  div.style.fontFamily = 'sans-serif';
                  div.style.color = 'black';
                  div.innerText = textArea.value;
                  textArea.parentNode?.replaceChild(div, textArea);
              });
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const ratio = canvasWidth / canvasHeight;
        const widthInPdf = pdfWidth;
        const heightInPdf = widthInPdf / ratio;

        let heightLeft = heightInPdf;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, widthInPdf, heightInPdf);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = position - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, widthInPdf, heightInPdf);
            heightLeft -= pdfHeight;
        }

        pdf.save('lesson-plan.pdf');
    } catch (e) {
        console.error("Error exporting PDF:", e);
        // You might want to show a toast or an alert to the user here
    } finally {
        // Close accordions back
        setAccordionValues([]);
        setIsExporting(false);
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
            <Presentation className="h-12 w-12 mb-4 animate-pulse" />
            <p className="font-semibold mb-2">Generating your lesson...</p>
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

  const hasQuestionPaper = lessonContent.questionPaperEnglish || lessonContent.questionPaperKannada;

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
           {hasQuestionPaper && (
            <Accordion type="multiple" className="w-full mt-4" value={accordionValues} onValueChange={setAccordionValues}>
              {lessonContent.questionPaperEnglish && (
                <AccordionItem value="qp-en">
                  <AccordionTrigger className="text-lg font-semibold font-headline">English Question Paper</AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      value={questionPaperEnglish}
                      onChange={(e) => setQuestionPaperEnglish(e.target.value)}
                      className="h-48 bg-white"
                      aria-label="English question paper"
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
              {lessonContent.answerKeyEnglish && (
                <AccordionItem value="ak-en">
                  <AccordionTrigger className="text-lg font-semibold font-headline">English Answer Key</AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      value={answerKeyEnglish}
                      onChange={(e) => setAnswerKeyEnglish(e.target.value)}
                      className="h-48 bg-white"
                      aria-label="English answer key"
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
              {lessonContent.questionPaperKannada && (
                <AccordionItem value="qp-kn">
                  <AccordionTrigger className="text-lg font-semibold font-headline">ಕನ್ನಡ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ</AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      value={questionPaperKannada}
                      onChange={(e) => setQuestionPaperKannada(e.target.value)}
                      className="h-48 bg-white"
                      aria-label="Kannada question paper"
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
              {lessonContent.answerKeyKannada && (
                 <AccordionItem value="ak-kn">
                  <AccordionTrigger className="text-lg font-semibold font-headline">ಕನ್ನಡ ಉತ್ತರ ಸೂಚಿ</AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      value={answerKeyKannada}
                      onChange={(e) => setAnswerKeyKannada(e.target.value)}
                      className="h-48 bg-white"
                      aria-label="Kannada answer key"
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </div>
        <Separator />
        <div className="flex flex-wrap gap-2">
          <Button disabled={isExporting}><Save /> Save to Library</Button>
          <Button variant="outline" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? 'Exporting...' : <><Download /> Export PDF</>}
            </Button>
          <Button variant="outline" disabled={isExporting}><Presentation /> Export Slides</Button>
        </div>
      </CardContent>
    </Card>
  );
}
