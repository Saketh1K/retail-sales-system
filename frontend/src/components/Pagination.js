import styles from '../app/page.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className={styles.pagination}>
            <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={styles.pageButton}
            >
                Previous
            </button>
            <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </span>
            <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={styles.pageButton}
            >
                Next
            </button>
        </div>
    );
}
