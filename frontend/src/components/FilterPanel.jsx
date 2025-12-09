import React from 'react';
import { Filter, X } from 'lucide-react';

const FilterSection = ({ title, children }) => (
    <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
        {children}
    </div>
);

const CheckboxGroup = ({ options, selected, onChange }) => {
    const handleChange = (value) => {
        const newSelected = selected.includes(value)
            ? selected.filter(item => item !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {options.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={() => handleChange(opt)}
                        style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent)' }}
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
};

export const FilterPanel = ({ filters, updateFilter, resetFilters, meta, isOpen, toggle }) => {
    return (
        <aside className={`panel ${isOpen ? 'open' : ''}`} style={{
            width: '300px',
            height: 'fit-content',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={20} /> Filters
                </h3>
                <button onClick={resetFilters} className="btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                    Reset
                </button>
            </div>

            <FilterSection title="Date Range">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => updateFilter('startDate', e.target.value)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => updateFilter('endDate', e.target.value)}
                        placeholder="End Date"
                    />
                </div>
            </FilterSection>

            <FilterSection title="Region">
                <CheckboxGroup
                    options={meta.regions}
                    selected={filters.region}
                    onChange={(val) => updateFilter('region', val)}
                />
            </FilterSection>

            <FilterSection title="Gender">
                <CheckboxGroup
                    options={['Male', 'Female', 'Other']} // Hardcoded fallback or from meta? meta doesn't include raw gender usually unless queried.
                    // My backend Controller.getMetadata does not return gender. I'll hardcode or add it. 
                    // Let's hardcode for simplicity as it's standard.
                    selected={filters.gender}
                    onChange={(val) => updateFilter('gender', val)}
                />
            </FilterSection>

            <FilterSection title="Age Range">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minAge}
                        onChange={(e) => updateFilter('minAge', e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxAge}
                        onChange={(e) => updateFilter('maxAge', e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
            </FilterSection>

            <FilterSection title="Category">
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    <CheckboxGroup
                        options={meta.categories}
                        selected={filters.category}
                        onChange={(val) => updateFilter('category', val)}
                    />
                </div>
            </FilterSection>

            <FilterSection title="Payment Method">
                <CheckboxGroup
                    options={meta.paymentMethods}
                    selected={filters.paymentMethod}
                    onChange={(val) => updateFilter('paymentMethod', val)}
                />
            </FilterSection>

            <FilterSection title="Tags">
                <input
                    type="text"
                    placeholder="e.g. organic, wireless"
                    value={Array.isArray(filters.tags) ? filters.tags.join(',') : filters.tags}
                    onChange={(e) => updateFilter('tags', e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])}
                />
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Comma separated</small>
            </FilterSection>

        </aside>
    );
};
