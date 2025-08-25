
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash2, Library } from "lucide-react";
import type { SavedLesson } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function MyLibraryPage() {
  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const lessonsFromStorage = localStorage.getItem('savedLessons');
      if (lessonsFromStorage) {
        setSavedLessons(JSON.parse(lessonsFromStorage));
      }
    } catch (error) {
      console.error("Failed to parse lessons from localStorage", error);
      setSavedLessons([]);
    }
  }, []);

  const handleDeleteLesson = (id: string) => {
    const updatedLessons = savedLessons.filter(lesson => lesson.id !== id);
    setSavedLessons(updatedLessons);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedLessons', JSON.stringify(updatedLessons));
    }
  };

  if (!isClient) {
    return null;
  }

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
          {savedLessons.length > 0 ? (
            <div className="space-y-4">
              {savedLessons.map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden">
                   <CardHeader className="flex flex-row items-center justify-between">
                    <div className="grid gap-1">
                      <CardTitle className="font-headline text-xl">{lesson.topic}</CardTitle>
                      <CardDescription>
                        Saved on: {new Date(lesson.savedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete lesson</span>
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this lesson from your library.
                          </Description>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                       <AccordionItem value="english-content">
                        <AccordionTrigger>English Content</AccordionTrigger>
                        <AccordionContent>
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap p-2 border rounded-md bg-muted/20">
                           {lesson.lessonContent.englishContent}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                       <AccordionItem value="kannada-content">
                        <AccordionTrigger>ಕನ್ನಡ ವಿಷಯ</AccordionTrigger>
                        <AccordionContent>
                           <div className="prose prose-sm max-w-none whitespace-pre-wrap p-2 border rounded-md bg-muted/20">
                           {lesson.lessonContent.kannadaContent}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      {lesson.lessonContent.urduContent && (
                        <AccordionItem value="urdu-content">
                          <AccordionTrigger>اردو مواد</AccordionTrigger>
                          <AccordionContent>
                             <div className="prose prose-sm max-w-none whitespace-pre-wrap p-2 border rounded-md bg-muted/20 font-urdu text-lg">
                             {lesson.lessonContent.urduContent}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
              <Library className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold font-headline mb-2">Your library is empty.</h3>
              <p>Generate a lesson and save it to see it here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
