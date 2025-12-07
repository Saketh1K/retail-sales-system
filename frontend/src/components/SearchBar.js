import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';

export default function SearchBar({ onSearch, initialValue = '' }) {
    const [query, setQuery] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300); // Debounce

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder="Search by Name or Phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
            />
        </div>
    );
}
