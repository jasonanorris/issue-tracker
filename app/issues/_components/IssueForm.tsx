'use client';
import { Button, Callout, Text, TextArea, TextField } from '@radix-ui/themes'
//import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/validationSchemas';
import {z} from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import dynamic from 'next/dynamic';
import { Issue } from '@prisma/client';
import SimpleMdeReact from 'react-simplemde-editor';

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({issue}: {issue?: Issue}) => {
  const router = useRouter();
  const {register, control, handleSubmit, formState: {errors}} = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema)
  });
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if(issue)
        await axios.patch('/api/issues/' + issue.id, data);
      else
        await axios.post('/api/issues', data);
      router.push('/issues/list');
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError('An unexpected error occurred.');
    }
  });

  return (
    <div className='max-w-xl'>
      {error && (
        <Callout.Root color='red' className='mb-5'>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form 
        className='space-y-3' 
        onSubmit={onSubmit}>
        <TextField.Root defaultValue={issue?.title} placeholder="Title" {...register('title')}/>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({field}) => <SimpleMdeReact placeholder="Description" {...field} />}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? 'Update Issue' : 'Submit New Issue'}{' '}
          {isSubmitting && <Spinner />}</Button>
      </form>
    </div>
  )
}

export default IssueForm