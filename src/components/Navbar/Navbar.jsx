import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <NavLink to="/" className={styles.navbar__brand}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="8" fill="url(#ng)" />
                    <path d="M8 14h4l2-5 3 10 2-5h3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                        <linearGradient id="ng" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6c63ff" />
                            <stop offset="1" stopColor="#00d4aa" />
                        </linearGradient>
                    </defs>
                </svg>
                <span>ReactAssess</span>
            </NavLink>

            <ul className={styles.navbar__links}>
                <li>
                    <NavLink to="/todos" className={({ isActive }) => isActive ? styles.active : ''}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Todos
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/forms" className={({ isActive }) => isActive ? styles.active : ''}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                        My Forms
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/form-builder" className={({ isActive }) => isActive ? styles.active : ''}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Builder
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/form-preview" className={({ isActive }) => isActive ? styles.active : ''}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
