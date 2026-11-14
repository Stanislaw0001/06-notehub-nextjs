import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Notes from './Notes.client';
import { NOTES_PER_PAGE, notesQueryOptions } from '@/lib/notes-query';

const INITIAL_NOTES_QUERY = {
    page: 1,
    perPage: NOTES_PER_PAGE,
    search: '',
};

export default async function NotesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(notesQueryOptions(INITIAL_NOTES_QUERY));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Notes />
        </HydrationBoundary>
    );
}
