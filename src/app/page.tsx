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
  const [topic, setTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()

  const handleGenerateLesson = async (data: GenerateBilingualLessonContentInput) => {
    setIsLoading(true);
    setError(null);
    setLessonContent(null);
    setTopic(data.topic);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-6">
      <LessonCreatorForm onGenerate={handleGenerateLesson} isLoading={isLoading} />
      <LessonPreview lessonContent={lessonContent} topic={topic} isLoading={isLoading} error={error} />
    </div>
  );
}
