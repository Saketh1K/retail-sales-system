import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const SortIcon = ({ active, order }) => {
    if (!active) return <span style={{ opacity: 0.1, marginLeft: '5px' }}>⇅</span>;
    return order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
};

export const SalesTable = ({ data, loading, sort, updateSort }) => {
    if (loading && data.length === 0) return (
        <div className="panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>Loading transactions...</div>
        </div>
    );

    if (!loading && data.length === 0) return (
        <div className="panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No results found</div>
            <p>Try adjusting your search or filters.</p>
        </div>
    );

    const headers = [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'customer_name', label: 'Customer', sortable: true },
        { key: 'phone', label: 'Phone', sortable: false },
        { key: 'region', label: 'Region', sortable: false },
        { key: 'product_name', label: 'Product', sortable: false },
        { key: 'category', label: 'Category', sortable: false },
        { key: 'quantity', label: 'Qty', sortable: true },
        { key: 'final_amount', label: 'Final Amount', sortable: false },
        { key: 'status', label: 'Status', sortable: false },
        { key: 'payment_method', label: 'Payment', sortable: false },
    ];

    return (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ background: 'var(--bg-tertiary)', color: 'var(--text-active)' }}>
                        <tr>
                            {headers.map(h => (
                                <th
                                    key={h.key}
                                    onClick={() => h.sortable ? updateSort(h.key) : null}
                                    style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        cursor: h.sortable ? 'pointer' : 'default',
                                        userSelect: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {h.label}
                                        {h.sortable && (
                                            <SortIcon active={sort.by === h.key} order={sort.order} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                        {data.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{row.date}</td>
                                <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-active)' }}>{row.customer_name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.phone}</td>
                                <td style={{ padding: '1rem' }}>{row.region}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>{row.product_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.brand}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        background: 'rgba(129, 140, 248, 0.1)',
                                        color: 'var(--accent)',
                                        fontSize: '0.75rem',
                                        border: '1px solid rgba(129, 140, 248, 0.2)'
                                    }}>
                                        {row.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{row.quantity}</td>
                                <td style={{ padding: '1rem' }}>
                                    {row.final_amount != null ? `₹${row.final_amount.toLocaleString()}` : '-'}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        background: row.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                                            row.status === 'Returned' ? 'rgba(239, 68, 68, 0.1)' :
                                                row.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: row.status === 'Completed' ? 'var(--success)' :
                                            row.status === 'Returned' ? 'var(--danger)' :
                                                row.status === 'Cancelled' ? 'var(--danger)' : 'var(--warning)',
                                        border: `1px solid ${row.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' :
                                                row.status === 'Returned' ? 'rgba(239, 68, 68, 0.2)' :
                                                    row.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                                            }`
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{row.payment_method}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
