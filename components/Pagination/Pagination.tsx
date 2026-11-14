'use client';

import css from './Pagination.module.css';

interface PaginationProps {
    totalPages: number;
    page: number;
    setPage: (nextPage: number) => void;
}

export default function Pagination({ totalPages, page, setPage }: PaginationProps) {
    return (
        <nav className={css.pagination} aria-label="Notes pagination">
            <button
                type="button"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
            >
                ←
            </button>
            <span aria-current="page">
                Page {page} of {totalPages}
            </span>
            <button
                type="button"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
            >
                →
            </button>
        </nav>
    );
}