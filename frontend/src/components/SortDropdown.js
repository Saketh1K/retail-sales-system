import styles from '../app/page.module.css';

export default function SortDropdown({ value, onChange }) {
    return (
        <div className={styles.sortDropdown}>
            <label>Sort by: </label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="date_desc">Date (Newest)</option>
                <option value="date_asc">Date (Oldest)</option>
                <option value="quantity_desc">Quantity (High-Low)</option>
                <option value="quantity_asc">Quantity (Low-High)</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
            </select>
        </div>
    );
}
