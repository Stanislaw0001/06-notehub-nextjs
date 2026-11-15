'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createNote, type CreateNoteInput } from '@/lib/api';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
    onCancel: () => void;
}

const validationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must be at most 50 characters')
        .required('Title is required'),
    content: Yup.string().max(500, 'Content must be at most 500 characters'),
    tag: Yup.mixed<NoteTag>().oneOf([...NOTE_TAGS]).required('Tag is required'),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
            onCancel();
        },
    });

    return (
        <Formik<CreateNoteInput>
            initialValues={{ title: '', content: '', tag: 'Todo' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setStatus }) => {
                setStatus(undefined);

                try {
                    await mutation.mutateAsync({
                        ...values,
                        title: values.title.trim(),
                    });
                } catch (error) {
                    setStatus(
                        error instanceof Error
                            ? `Could not create the note: ${error.message}`
                            : 'Could not create the note. Please try again.'
                    );
                }
            }}
        >
            {({ isSubmitting, status }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field
                            id="title"
                            type="text"
                            name="title"
                            className={css.input}
                        />
                        <ErrorMessage
                            name="title"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            as="textarea"
                            id="content"
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage
                            name="content"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field
                            as="select"
                            id="tag"
                            name="tag"
                            className={css.select}
                        >
                            {NOTE_TAGS.map(tag => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </Field>
                    </div>

                    {typeof status === 'string' && (
                        <p className={css.error} role="alert">
                            {status}
                        </p>
                    )}

                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting || mutation.isPending}
                        >
                            {isSubmitting || mutation.isPending
                                ? 'Creating...'
                                : 'Create note'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}