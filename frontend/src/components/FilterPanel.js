import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';

export default function FilterPanel({ filters, onChange, options }) {
    const handleCheckboxChange = (category, value) => {
        const currentValues = filters[category] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        onChange({ ...filters, [category]: newValues });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...filters, [name]: value });
    };

    return (
        <div className={styles.filterPanel}>
            <h3>Filters</h3>

            <div className={styles.filterGroup}>
                <h4>Region</h4>
                {options.regions?.map(region => (
                    <label key={region} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.region?.includes(region) || false}
                            onChange={() => handleCheckboxChange('region', region)}
                        />
                        {region}
                    </label>
                ))}
            </div>

            <div className={styles.filterGroup}>
                <h4>Category</h4>
                {options.categories?.map(cat => (
                    <label key={cat} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.category?.includes(cat) || false}
                            onChange={() => handleCheckboxChange('category', cat)}
                        />
                        {cat}
                    </label>
                ))}
            </div>

            <div className={styles.filterGroup}>
                <h4>Payment Method</h4>
                {options.paymentMethods?.map(pm => (
                    <label key={pm} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.paymentMethod?.includes(pm) || false}
                            onChange={() => handleCheckboxChange('paymentMethod', pm)}
                        />
                        {pm}
                    </label>
                ))}
            </div>

            <div className={styles.filterGroup}>
                <h4>Gender</h4>
                {options.genders?.map(g => (
                    <label key={g} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.gender?.includes(g) || false}
                            onChange={() => handleCheckboxChange('gender', g)}
                        />
                        {g}
                    </label>
                ))}
            </div>

            <div className={styles.filterGroup}>
                <h4>Tags</h4>
                {options.tags?.map(tag => (
                    <label key={tag} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.tags?.includes(tag) || false}
                            onChange={() => handleCheckboxChange('tags', tag)}
                        />
                        {tag}
                    </label>
                ))}
            </div>

            <div className={styles.filterGroup}>
                <h4>Age Range</h4>
                <div className={styles.rangeInputs}>
                    <input type="number" name="minAge" placeholder="Min" value={filters.minAge || ''} onChange={handleInputChange} />
                    <span>-</span>
                    <input type="number" name="maxAge" placeholder="Max" value={filters.maxAge || ''} onChange={handleInputChange} />
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4>Date Range</h4>
                <div className={styles.dateInputs}>
                    <input type="date" name="startDate" value={filters.startDate || ''} onChange={handleInputChange} />
                    <input type="date" name="endDate" value={filters.endDate || ''} onChange={handleInputChange} />
                </div>
            </div>
        </div>
    );
}
