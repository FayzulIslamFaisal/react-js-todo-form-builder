/**
 * useTodoStore – lightweight state management hook using
 * React state + localStorage for persistence.
 *
 * Stores: selectedUser, selectedStatus, currentPage, searchQuery
 * Todos & users are fetched fresh each mount but filters persist.
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'todo_filters';

function loadFilters() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (_) { }
    return { selectedUser: '', selectedStatus: '', currentPage: 1, searchQuery: '' };
}

function saveFilters(filters) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

export function useTodoStore() {
    const [todos, setTodos] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Persistent filter state
    const [filters, setFilters] = useState(loadFilters);

    // Whenever filters change, persist to localStorage
    useEffect(() => {
        saveFilters(filters);
    }, [filters]);

    // Fetch todos + users from JSONPlaceholder
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        Promise.all([
            fetch('https://jsonplaceholder.typicode.com/todos').then(r => r.json()),
            fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
        ])
            .then(([todosData, usersData]) => {
                if (cancelled) return;
                setTodos(todosData);
                setUsers(usersData);
                setLoading(false);
            })
            .catch(err => {
                if (cancelled) return;
                setError(err.message);
                setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    // Computed: filtered todos
    const filteredTodos = todos.filter(todo => {
        const matchUser = filters.selectedUser ? todo.userId === Number(filters.selectedUser) : true;
        const matchStatus = filters.selectedStatus
            ? filters.selectedStatus === 'completed' ? todo.completed : !todo.completed
            : true;
        const matchSearch = filters.searchQuery
            ? todo.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
            : true;
        return matchUser && matchStatus && matchSearch;
    });

    // Helpers
    const getUserName = useCallback(
        (userId) => users.find(u => u.id === userId)?.name ?? `User ${userId}`,
        [users]
    );

    const setFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, currentPage: key !== 'currentPage' ? 1 : prev.currentPage }));
    }, []);

    const setPage = useCallback((page) => {
        setFilters(prev => ({ ...prev, currentPage: page }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ selectedUser: '', selectedStatus: '', currentPage: 1, searchQuery: '' });
    }, []);

    return {
        todos,
        users,
        loading,
        error,
        filteredTodos,
        filters,
        setFilter,
        setPage,
        resetFilters,
        getUserName,
    };
}
