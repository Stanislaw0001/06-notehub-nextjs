'use client';

import css from './Pagination.module.css';

interface PaginationProps {
    totalPages: number;
    page: number;
    setPage: (nextPage: number) => void;
}

export default function Pagination({ totalPages, page, setPage }: PaginationProps) {
    return (
        <nav aria-label="Notes pagination">
            <ul className={css.pagination}>
                <li>
                    <a
                        href="#"
                        aria-label="Previous page"
                        aria-disabled={page <= 1}
                        onClick={event => {
                            event.preventDefault();
                            if (page > 1) setPage(page - 1);
                        }}
                    >
                        ←
                    </a>
                </li>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    pageNumber => (
                        <li
                            className={pageNumber === page ? css.active : undefined}
                            key={pageNumber}
                        >
                            <a
                                href="#"
                                aria-current={pageNumber === page ? 'page' : undefined}
                                onClick={event => {
                                    event.preventDefault();
                                    setPage(pageNumber);
                                }}
                            >
                                {pageNumber}
                            </a>
                        </li>
                    )
                )}
                <li>
                    <a
                        href="#"
                        aria-label="Next page"
                        aria-disabled={page >= totalPages}
                        onClick={event => {
                            event.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                        }}
                    >
                        →
                    </a>
                </li>
            </ul>
        </nav>
    );
}