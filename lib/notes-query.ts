import { queryOptions } from '@tanstack/react-query';
import { fetchNoteById, fetchNotes, type FetchNotesParams } from '@/lib/api';

export const NOTES_PER_PAGE = 12;

export function notesQueryOptions(params: FetchNotesParams) {
    return queryOptions({
        queryKey: ['notes', params] as const,
        queryFn: () => fetchNotes(params),
        staleTime: 60_000,
    });
}

export function noteQueryOptions(noteId: string) {
    return queryOptions({
        queryKey: ['note', noteId] as const,
        queryFn: () => fetchNoteById(noteId),
        staleTime: 60_000,
    });
}
