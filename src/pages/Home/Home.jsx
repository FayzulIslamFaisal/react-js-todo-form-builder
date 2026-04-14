import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
    return (
        <main className={styles.home}>
            <span className={styles.home__badge}>⚡ React Assessment</span>

            <h1 className={styles.home__title}>
                Build. Filter. <span>Preview.</span>
            </h1>

            <p className={styles.home__sub}>
                A full-featured React application showcasing Todo list management with
                live API data and a dynamic drag-and-drop Form Builder.
            </p>

            <div className={styles.home__cards}>
                <Link to="/todos" className={styles.home__card}>
                    <div className={`${styles.home__card__icon} ${styles['home__card__icon--todo']}`}>
                        ✅
                    </div>
                    <div className={styles.home__card__title}>Todo List</div>
                    <p className={styles.home__card__desc}>
                        Fetch real todos from JSONPlaceholder API. Filter by user &amp; status, with
                        persistent state across navigation and pagination.
                    </p>
                    <div className={styles.home__card__arrow}>Explore Todos →</div>
                </Link>

                <Link to="/form-builder" className={styles.home__card}>
                    <div className={`${styles.home__card__icon} ${styles['home__card__icon--form']}`}>
                        🧩
                    </div>
                    <div className={styles.home__card__title}>Dynamic Form Builder</div>
                    <p className={styles.home__card__desc}>
                        Design your own custom forms by adding fields with various input types.
                        Save, preview, and submit them — all in the browser.
                    </p>
                    <div className={styles.home__card__arrow}>Open Builder →</div>
                </Link>
            </div>
        </main>
    );
}
