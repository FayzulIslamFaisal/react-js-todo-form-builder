/**
 * useFormStore – state management for Dynamic Form Builder.
 * Supports multiple named forms, each saved independently to localStorage.
 */
import { useState, useCallback } from 'react';

const FORMS_KEY = 'form_builder_forms';
const ACTIVE_KEY = 'form_builder_active_id';

function loadForms() {
    try {
        const raw = localStorage.getItem(FORMS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (_) { return {}; }
}

function saveForms(forms) {
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

function loadActiveId() {
    return localStorage.getItem(ACTIVE_KEY) || null;
}

function makeForm(title = 'Untitled Form') {
    return {
        id: `form_${Date.now()}`,
        title,
        fields: [],
        createdAt: new Date().toISOString(),
    };
}

export function useFormStore() {
    const [forms, setFormsState] = useState(loadForms);
    const [activeFormId, setActiveFormIdState] = useState(loadActiveId);

    const persistForms = useCallback((updated) => {
        setFormsState(updated);
        saveForms(updated);
    }, []);

    const setActiveId = useCallback((id) => {
        setActiveFormIdState(id);
        if (id) localStorage.setItem(ACTIVE_KEY, id);
        else localStorage.removeItem(ACTIVE_KEY);
    }, []);

    const formList = Object.values(forms).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const activeForm = activeFormId ? forms[activeFormId] : null;
    const fields = activeForm?.fields ?? [];
    const formTitle = activeForm?.title ?? '';

    const createForm = useCallback((title = 'Untitled Form') => {
        const form = makeForm(title);
        const updated = { ...forms, [form.id]: form };
        persistForms(updated);
        setActiveId(form.id);
        return form.id;
    }, [forms, persistForms, setActiveId]);

    const deleteForm = useCallback((id) => {
        const updated = { ...forms };
        delete updated[id];
        persistForms(updated);
        if (activeFormId === id) {
            const remaining = Object.keys(updated);
            setActiveId(remaining.length ? remaining[0] : null);
        }
    }, [forms, activeFormId, persistForms, setActiveId]);

    const selectForm = useCallback((id) => {
        setActiveId(id);
    }, [setActiveId]);

    const setFormTitle = useCallback((title) => {
        if (!activeFormId) return;
        const updated = {
            ...forms,
            [activeFormId]: { ...forms[activeFormId], title },
        };
        persistForms(updated);
    }, [activeFormId, forms, persistForms]);

    const saveFields = useCallback((newFields) => {
        if (!activeFormId) return;
        const updated = {
            ...forms,
            [activeFormId]: { ...forms[activeFormId], fields: newFields },
        };
        persistForms(updated);
    }, [activeFormId, forms, persistForms]);

    const addField = useCallback(() => {
        const newField = {
            id: Date.now().toString(),
            label: '',
            type: 'text',
            placeholder: '',
            required: false,
            options: '',
            min: '',
            max: '',
            step: '',
            accept: '',
            multiple: false,
            defaultValue: '',
            rows: '4',
            src: '',
            alt: '',
            imageWidth: '',
            imageHeight: '',
        };
        saveFields([...fields, newField]);
    }, [fields, saveFields]);

    const updateField = useCallback((id, key, value) => {
        saveFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    }, [fields, saveFields]);

    const removeField = useCallback((id) => {
        saveFields(fields.filter(f => f.id !== id));
    }, [fields, saveFields]);

    const moveField = useCallback((index, direction) => {
        const arr = [...fields];
        const target = index + direction;
        if (target < 0 || target >= arr.length) return;
        [arr[index], arr[target]] = [arr[target], arr[index]];
        saveFields(arr);
    }, [fields, saveFields]);

    const clearSchema = useCallback(() => {
        saveFields([]);
    }, [saveFields]);

    return {
        formList,
        forms,
        activeFormId,
        activeForm,
        createForm,
        deleteForm,
        selectForm,
        fields,
        formTitle,
        setFormTitle,
        addField,
        updateField,
        removeField,
        moveField,
        clearSchema,
    };
}
