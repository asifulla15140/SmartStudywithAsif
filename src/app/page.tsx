'use client';

import { useState } from 'react';
import type { GenerateBilingualLessonContentInput } from '@/ai/flows/generate-lesson-content';
import { generateBilingualLessonContent } from '@/ai/flows/generate-lesson-content';
import { LessonCreatorForm } from '@/components/lesson-creator-form';
import { LessonPreview } from '@/components/lesson-preview';
import { useToast } from "@/hooks/use-toast"
import type { LessonContent } from '@/lib/types';

export default function Home() {
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()

  const handleGenerateLesson = async (data: GenerateBilingualLessonContentInput) => {
    setIsLoading(true);
    setError(null);
    setLessonContent(null);
    try {
      const result = await generateBilingualLessonContent(data);
      if (result) {
        setLessonContent(result);
      } else {
        throw new Error("AI did not return content.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(`Failed to generate lesson: ${errorMessage}`);
       toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was a problem generating the lesson content. Please try again.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 items-start p-4 sm:p-6 md:gap-8 lg:grid lg:grid-cols-5">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <LessonCreatorForm onGenerate={handleGenerateLesson} isLoading={isLoading} />
      </div>
      <div className="lg:col-span-2 mt-8 lg:mt-0">
        <LessonPreview lessonContent={lessonContent} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
