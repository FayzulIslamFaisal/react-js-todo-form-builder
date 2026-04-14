import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import styles from './FormsList.module.css';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

export default function FormsList() {
    const navigate = useNavigate();
    const { formList, createForm, deleteForm, selectForm } = useFormStore();
    const [newTitle, setNewTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    function handleCreate() {
        const title = newTitle.trim() || 'Untitled Form';
        createForm(title);
        setNewTitle('');
        setCreating(false);
        navigate('/form-builder');
    }

    function handleOpen(id) {
        selectForm(id);
        navigate('/form-builder');
    }

    function handlePreview(id) {
        selectForm(id);
        navigate('/form-preview');
    }

    function handleDelete(id) {
        deleteForm(id);
        setDeleteConfirm(null);
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.header__title}>
                        My <span>Forms</span>
                    </h1>
                    <p className={styles.header__subtitle}>
                        Create and manage all your form schemas. Each form is saved to localStorage.
                    </p>
                </div>
                <button
                    className={styles.btnNew}
                    onClick={() => setCreating(true)}
                    id="new-form-btn"
                >
                    + New Form
                </button>
            </div>

            {/* Create form dialog */}
            {creating && (
                <div className={styles.createBox}>
                    <span className={styles.createBox__icon}>📄</span>
                    <input
                        autoFocus
                        type="text"
                        className={styles.createInput}
                        placeholder="Form title (e.g. Contact Us)"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleCreate();
                            if (e.key === 'Escape') setCreating(false);
                        }}
                    />
                    <button className={styles.btnConfirm} onClick={handleCreate}>
                        Create
                    </button>
                    <button className={styles.btnCancel} onClick={() => setCreating(false)}>
                        Cancel
                    </button>
                </div>
            )}

            {/* Empty state */}
            {formList.length === 0 && !creating && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyState__icon}>🗂️</div>
                    <div className={styles.emptyState__title}>No forms yet</div>
                    <p>Click &ldquo;+ New Form&rdquo; to create your first form.</p>
                </div>
            )}

            {/* Forms grid */}
            {formList.length > 0 && (
                <div className={styles.grid}>
                    {formList.map(form => (
                        <div key={form.id} className={styles.card}>
                            <div className={styles.card__body} onClick={() => handleOpen(form.id)}>
                                <div className={styles.card__icon}>📋</div>
                                <div className={styles.card__info}>
                                    <div className={styles.card__title}>{form.title}</div>
                                    <div className={styles.card__meta}>
                                        <span>{form.fields.length} field{form.fields.length !== 1 ? 's' : ''}</span>
                                        <span className={styles.card__dot}>·</span>
                                        <span>Created {formatDate(form.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.card__actions}>
                                <button
                                    className={styles.btnEdit}
                                    onClick={() => handleOpen(form.id)}
                                    title="Edit form"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className={styles.btnPreview}
                                    onClick={() => handlePreview(form.id)}
                                    disabled={form.fields.length === 0}
                                    title="Preview form"
                                >
                                    👁 Preview
                                </button>
                                {deleteConfirm === form.id ? (
                                    <>
                                        <button
                                            className={styles.btnDeleteConfirm}
                                            onClick={() => handleDelete(form.id)}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className={styles.btnCancel}
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className={styles.btnDelete}
                                        onClick={() => setDeleteConfirm(form.id)}
                                        title="Delete form"
                                    >
                                        🗑
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
