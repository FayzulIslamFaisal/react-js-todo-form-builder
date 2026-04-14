import { useMemo } from 'react';
import { useTodoStore } from '../../store/useTodoStore';
import styles from './TodoList.module.css';

const PAGE_SIZE = 12;

function getPaginationRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

export default function TodoList() {
    const {
        users, loading, error,
        filteredTodos, filters,
        setFilter, setPage, resetFilters,
        getUserName,
    } = useTodoStore();

    const totalPages = Math.ceil(filteredTodos.length / PAGE_SIZE);

    const currentTodos = useMemo(() => {
        const start = (filters.currentPage - 1) * PAGE_SIZE;
        return filteredTodos.slice(start, start + PAGE_SIZE);
    }, [filteredTodos, filters.currentPage]);

    const paginationRange = useMemo(
        () => getPaginationRange(filters.currentPage, totalPages),
        [filters.currentPage, totalPages]
    );

    const completedCount = filteredTodos.filter(t => t.completed).length;
    const pendingCount = filteredTodos.length - completedCount;

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <span>Fetching todos from JSONPlaceholder…</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>
                    <p>⚠️ Failed to load todos: {error}</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Please check your internet connection.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.header__title}>
                    <span>Todo</span> List
                </h1>
                <p className={styles.header__subtitle}>
                    Fetched from JSONPlaceholder API · Filters are persisted across navigation
                </p>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                {/* Search */}
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Search</label>
                    <input
                        id="todo-search"
                        type="text"
                        className={styles.filterInput}
                        placeholder="Search todos…"
                        value={filters.searchQuery}
                        onChange={e => setFilter('searchQuery', e.target.value)}
                    />
                </div>

                {/* User filter */}
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Filter by User</label>
                    <select
                        id="todo-user-filter"
                        className={styles.filterSelect}
                        value={filters.selectedUser}
                        onChange={e => setFilter('selectedUser', e.target.value)}
                    >
                        <option value="">All Users</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status filter */}
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Filter by Status</label>
                    <select
                        id="todo-status-filter"
                        className={styles.filterSelect}
                        value={filters.selectedStatus}
                        onChange={e => setFilter('selectedStatus', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="completed">✅ Completed</option>
                        <option value="pending">⏳ Pending</option>
                    </select>
                </div>

                {(filters.searchQuery || filters.selectedUser || filters.selectedStatus) && (
                    <button
                        id="todo-reset-filters"
                        className={styles.filterReset}
                        onClick={resetFilters}
                    >
                        ✕ Reset
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className={styles.statsBar}>
                <span className={`${styles.statChip} ${styles['statChip--primary']}`}>
                    📋 {filteredTodos.length} todos
                </span>
                <span className={`${styles.statChip} ${styles['statChip--success']}`}>
                    ✅ {completedCount} completed
                </span>
                <span className={`${styles.statChip} ${styles['statChip--warning']}`}>
                    ⏳ {pendingCount} pending
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.82rem' }}>
                    Page {filters.currentPage} of {totalPages || 1}
                </span>
            </div>

            {/* Todo Grid */}
            {currentTodos.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.empty__icon}>🔍</div>
                    <div className={styles.empty__title}>No todos found</div>
                    <p>Try adjusting your filters.</p>
                </div>
            ) : (
                <div className={styles.todoGrid}>
                    {currentTodos.map(todo => {
                        const userName = getUserName(todo.userId);
                        const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                        return (
                            <div
                                key={todo.id}
                                className={`${styles.card} ${todo.completed ? styles['card--completed'] : ''}`}
                            >
                                <div className={styles.card__top}>
                                    <div className={styles.card__check}>
                                        {todo.completed && '✓'}
                                    </div>
                                    <p className={styles.card__title}>{todo.title}</p>
                                </div>
                                <div className={styles.card__footer}>
                                    <div className={styles.card__user}>
                                        <div className={styles.card__avatar}>{initials}</div>
                                        {userName}
                                    </div>
                                    <span className={`${styles.badge} ${todo.completed ? styles['badge--completed'] : styles['badge--pending']}`}>
                                        {todo.completed ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        id="page-prev"
                        className={styles.pageBtn}
                        onClick={() => setPage(filters.currentPage - 1)}
                        disabled={filters.currentPage === 1}
                    >
                        ‹
                    </button>

                    {paginationRange.map((p, idx) =>
                        p === '...' ? (
                            <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>…</span>
                        ) : (
                            <button
                                key={p}
                                id={`page-${p}`}
                                className={`${styles.pageBtn} ${p === filters.currentPage ? styles['pageBtn--active'] : ''}`}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        id="page-next"
                        className={styles.pageBtn}
                        onClick={() => setPage(filters.currentPage + 1)}
                        disabled={filters.currentPage === totalPages}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}
