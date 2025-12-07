import styles from '../app/page.module.css';

export default function StatsCard({ title, count, amount, type }) {
    return (
        <div className={`${styles.statsCard} ${styles[type]}`}>
            <h4>{title}</h4>
            <div className={styles.statsValue}>{count}</div>
            <div className={styles.statsAmount}>₹{amount?.toLocaleString()}</div>
        </div>
    );
}
