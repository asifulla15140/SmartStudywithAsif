'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { GenerateBilingualLessonContentInput } from '@/ai/flows/generate-lesson-content';
import { generateBilingualLessonContent } from '@/ai/flows/generate-lesson-content';
import { LessonPreview } from '@/components/lesson-preview';
import type { LessonContent } from '@/lib/types';
import { Label } from '@/components/ui/label';

export default function QuestionPapersPage() {
  return (
    <div className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Question Papers</CardTitle>
          <CardDescription>
            Generate AI-enhanced annual and supplementary question papers for 10th-grade students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="annual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="annual">Annual Papers</TabsTrigger>
              <TabsTrigger value="supplementary">Supplementary Papers</TabsTrigger>
            </TabsList>
            <TabsContent value="annual">
              <QuestionPaperGenerator type="Annual" />
            </TabsContent>
            <TabsContent value="supplementary">
              <QuestionPaperGenerator type="Supplementary" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface QuestionPaperGeneratorProps {
  type: 'Annual' | 'Supplementary';
}

function QuestionPaperGenerator({ type }: QuestionPaperGeneratorProps) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a subject.',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLessonContent(null);
    
    const generatedTopic = `${subject} - ${type} Question Paper`;
    setTopic(generatedTopic);

    const input: GenerateBilingualLessonContentInput = {
      topic: generatedTopic,
      gradeLevel: 'Grade 10',
      teachingMethods: ['Question Paper'],
    };

    try {
      const result = await generateBilingualLessonContent(input);
      if (result) {
        setLessonContent(result);
      } else {
        throw new Error('AI did not return content.');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate question paper: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was a problem generating the question paper. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">New {type} Question Paper</CardTitle>
                <CardDescription>Enter a subject to generate a new {type.toLowerCase()} question paper.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleGenerate} className="grid auto-rows-max items-start gap-4 md:gap-8">
                    <div className="grid gap-3">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                            id="subject" 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Mathematics, Science, History"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Generating...' : `Generate ${type} Paper`}
                    </Button>
                </form>
            </CardContent>
        </Card>

      <LessonPreview lessonContent={lessonContent} topic={topic} isLoading={isLoading} error={error} />
    </div>
  );
}
