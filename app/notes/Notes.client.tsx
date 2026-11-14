'use client';

import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { NOTES_PER_PAGE, notesQueryOptions } from '@/lib/notes-query';
import css from './NotesPage.module.css';

export default function Notes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);

        return () => window.clearTimeout(timeoutId);
    }, [searchInput]);

    const { data, isPending, isError, error } = useQuery({
        ...notesQueryOptions({ page, perPage: NOTES_PER_PAGE, search }),
        placeholderData: keepPreviousData,
    });

    return (
        <main className={css.main}>
            <header className={css.toolbar}>
                <SearchBox value={searchInput} onChange={setSearchInput} />
                {data && data.totalPages > 1 && (
                    <Pagination
                        totalPages={data.totalPages}
                        page={page}
                        setPage={setPage}
                    />
                )}
                <button
                    className={css.createButton}
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            {isPending && <p>Завантаження...</p>}
            {isError && <p role="alert">Помилка: {error.message}</p>}
            {data && (
                <div className={css.container}>
                    <NoteList
                        notes={data.notes}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            )}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </main>
    );
}

