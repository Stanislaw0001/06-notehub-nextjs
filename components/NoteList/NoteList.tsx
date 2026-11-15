'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import type { Note } from '../../types/note';
import { deleteNote } from '../../lib/api';
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
    page: number;
    setPage: (page: number) => void;
}

export default function NoteList({ notes, page, setPage }: NoteListProps) {
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState('');

    const { mutate, isPending, variables } = useMutation({
        mutationFn: (noteId: string) => deleteNote(noteId),
        onMutate: () => setErrorMessage(''),
        onSuccess: async () => {
            if (notes.length === 1 && page > 1) {
                setPage(page - 1);
            }
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            setErrorMessage(
                error instanceof Error
                    ? `Could not delete the note: ${error.message}`
                    : 'Could not delete the note. Please try again.'
            );
        },
    });

    return (
        <>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <ul className={css.list}>
                {notes.map(note => (
                    <li className={css.listItem} key={note.id}>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>
                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>
                            <Link className={css.link} href={`/notes/${note.id}`}>
                                View details
                            </Link>
                            <button
                                className={css.button}
                                type="button"
                                disabled={isPending}
                                onClick={() => mutate(note.id)}
                            >
                                {isPending && variables === note.id
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}