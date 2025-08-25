'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BrainCircuit,
  ClipboardList,
  CircleHelp,
  BookOpenText,
  Lightbulb,
  FileText,
  Bot,
  type LucideIcon,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { GenerateBilingualLessonContentInput } from '@/lib/types';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
  gradeLevel: z.string({
    required_error: 'Please select a grade level.',
  }),
  teachingMethods: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one teaching method.',
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface LessonCreatorFormProps {
  onGenerate: (data: GenerateBilingualLessonContentInput) => void;
  isLoading: boolean;
}

const teachingMethods: { name: string; icon: LucideIcon; description: string }[] = [
  { name: 'Analogy', icon: Lightbulb, description: 'Explain via familiar concepts' },
  { name: 'Story', icon: BookOpenText, description: 'Narrate a compelling story' },
  { name: 'Mnemonic', icon: BrainCircuit, description: 'Create a memory aid' },
  { name: 'Worksheet', icon: ClipboardList, description: 'Design practice activities' },
  { name: 'Quiz', icon: CircleHelp, description: 'Generate review questions' },
  { name: 'Question Paper', icon: FileText, description: 'Create an exam paper' },
  { name: 'AI Summary', icon: Bot, description: 'Summarize with AI' },
];

export function LessonCreatorForm({ onGenerate, isLoading }: LessonCreatorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      teachingMethods: [],
    },
  });

  function onSubmit(values: FormValues) {
    onGenerate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Create a New Lesson</CardTitle>
        <CardDescription>Fill in the details below to generate your bilingual lesson plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Photosynthesis, The Solar System" {...field} />
                  </FormControl>
                  <FormDescription>What subject do you want to teach?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={`Grade ${i + 1}`}>
                          Grade {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the appropriate grade for this lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teachingMethods"
              render={() => (
                <FormItem>
                  <FormLabel>Teaching Methods</FormLabel>
                  <FormDescription>Select one or more methods to structure the lesson.</FormDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    {teachingMethods.map((method) => (
                      <FormField
                        key={method.name}
                        control={form.control}
                        name="teachingMethods"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Controller
                                name="teachingMethods"
                                control={form.control}
                                render={({ field: controllerField }) => (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentValues = controllerField.value || [];
                                      const newValues = currentValues.includes(method.name)
                                        ? currentValues.filter((v) => v !== method.name)
                                        : [...currentValues, method.name];
                                      controllerField.onChange(newValues);
                                    }}
                                    className={cn(
                                      'w-full h-full text-left p-4 border rounded-lg transition-all',
                                      'hover:border-primary hover:shadow-md',
                                      controllerField.value?.includes(method.name) && 'border-primary bg-primary/5 shadow-md'
                                    )}
                                  >
                                    <div className="flex flex-col items-center gap-2">
                                      <method.icon className={cn('w-8 h-8', controllerField.value?.includes(method.name) ? 'text-primary' : 'text-muted-foreground')} />
                                      <span className="font-semibold">{method.name}</span>
                                      <p className="text-xs text-center text-muted-foreground">{method.description}</p>
                                    </div>
                                  </button>
                                )}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Generating...' : 'Generate Lesson'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
