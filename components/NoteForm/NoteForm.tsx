'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNoteInput } from '@/lib/api';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
    onCancel: () => void;
}

function isNoteTag(value: string): value is NoteTag {
    return NOTE_TAGS.some(noteTag => noteTag === value);
}

export default function NoteForm({ onCancel }: NoteFormProps) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState<NoteTag>('Todo');
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
    const [status, setStatus] = useState<string>();

    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
            onCancel();
        },
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus(undefined);

        const trimmedTitle = title.trim();
        const nextErrors: typeof errors = {};

        if (trimmedTitle.length < 3) {
            nextErrors.title = 'Title must be at least 3 characters';
        } else if (trimmedTitle.length > 50) {
            nextErrors.title = 'Title must be at most 50 characters';
        }

        if (content.length > 500) {
            nextErrors.content = 'Content must be at most 500 characters';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const note: CreateNoteInput = { title: trimmedTitle, content, tag };
        try {
            await mutation.mutateAsync(note);
        } catch (error) {
            setStatus(
                error instanceof Error
                    ? `Could not create the note: ${error.message}`
                    : 'Could not create the note. Please try again.'
            );
        }
    }

    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    aria-invalid={Boolean(errors.title)}
                />
                {errors.title && <span className={css.error}>{errors.title}</span>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    value={content}
                    onChange={event => setContent(event.target.value)}
                    aria-invalid={Boolean(errors.content)}
                />
                {errors.content && <span className={css.error}>{errors.content}</span>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={tag}
                    onChange={event => {
                        if (isNoteTag(event.target.value)) {
                            setTag(event.target.value);
                        }
                    }}
                >
                    {NOTE_TAGS.map(tag => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {status && <p className={css.error} role="alert">{status}</p>}

            <div className={css.actions}>
                <button type="button" className={css.cancelButton} onClick={onCancel}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Creating...' : 'Create note'}
                </button>
            </div>
        </form>
    );
}