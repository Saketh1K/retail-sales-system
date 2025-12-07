import styles from '../app/page.module.css';

export default function TransactionTable({ data }) {
    if (!data || data.length === 0) {
        return <div className={styles.noData}>No transactions found.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer Name</th>
                        <th>Phone</th>
                        <th>Region</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item['Date']}</td>
                            <td>{item['Customer Name']}</td>
                            <td>{item['Phone Number']}</td>
                            <td>{item['Customer Region']}</td>
                            <td>{item['Product Category']}</td>
                            <td>{item['Quantity']}</td>
                            <td>{item['Total Amount']}</td>
                            <td>{item['Payment Method']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
