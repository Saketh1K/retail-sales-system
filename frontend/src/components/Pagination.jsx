import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, setPage }) => {
    const { page, totalPages, total } = pagination;

    if (totalPages <= 1 && total > 0) return (
        <div style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {total} results
        </div>
    );
    if (total === 0) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Item <strong>{(page - 1) * 10 + 1}</strong> - <strong>{Math.min(page * 10, total)}</strong> of <strong>{total}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="btn btn-secondary"
                    style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer', padding: '0.5rem 1rem' }}
                >
                    <ChevronLeft size={16} /> Previous
                </button>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="btn btn-secondary"
                    style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer', padding: '0.5rem 1rem' }}
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
