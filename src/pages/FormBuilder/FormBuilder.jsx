import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import styles from './FormBuilder.module.css';

// ── All HTML5 input types ─────────────────────────────────────────────────────
export const INPUT_TYPES = [
    // Text-like
    { value: 'text',           label: 'Text',            group: 'Text' },
    { value: 'email',          label: 'Email',           group: 'Text' },
    { value: 'password',       label: 'Password',        group: 'Text' },
    { value: 'search',         label: 'Search',          group: 'Text' },
    { value: 'url',            label: 'URL',             group: 'Text' },
    { value: 'tel',            label: 'Telephone',       group: 'Text' },
    { value: 'textarea',       label: 'Textarea',        group: 'Text' },
    // Numeric
    { value: 'number',         label: 'Number',          group: 'Numeric' },
    { value: 'range',          label: 'Range (Slider)',  group: 'Numeric' },
    // Date & Time
    { value: 'date',           label: 'Date',            group: 'Date & Time' },
    { value: 'datetime-local', label: 'Date + Time',     group: 'Date & Time' },
    { value: 'time',           label: 'Time',            group: 'Date & Time' },
    { value: 'month',          label: 'Month',           group: 'Date & Time' },
    { value: 'week',           label: 'Week',            group: 'Date & Time' },
    // Choice
    { value: 'select',         label: 'Dropdown (Select)', group: 'Choice' },
    { value: 'radio',          label: 'Radio Buttons',   group: 'Choice' },
    { value: 'checkbox',       label: 'Checkboxes',      group: 'Choice' },
    // Special
    { value: 'color',          label: 'Color Picker',    group: 'Special' },
    { value: 'file',           label: 'File Upload',     group: 'Special' },
    { value: 'hidden',         label: 'Hidden',          group: 'Special' },
    { value: 'image',          label: 'Image Button',    group: 'Special' },
    // Buttons
    { value: 'button',         label: 'Button',          group: 'Buttons' },
    { value: 'submit',         label: 'Submit Button',   group: 'Buttons' },
    { value: 'reset',          label: 'Reset Button',    group: 'Buttons' },
];

// Group types for the <select> optgroups
const TYPE_GROUPS = [...new Set(INPUT_TYPES.map(t => t.group))];

// Which types need an options list
const needsOptions = (type) => ['select', 'radio', 'checkbox'].includes(type);
// Which types have min/max/step
const needsRange = (type) => ['number', 'range', 'date', 'datetime-local', 'time', 'month', 'week'].includes(type);
// Which types have a placeholder
const hasPlaceholder = (type) => !['file', 'date', 'datetime-local', 'time', 'month', 'week',
    'color', 'range', 'radio', 'checkbox', 'hidden', 'image',
    'button', 'submit', 'reset'].includes(type);

export default function FormBuilder() {
    const navigate = useNavigate();
    const {
        formList,
        activeFormId,
        fields,
        formTitle,
        setFormTitle,
        addField,
        updateField,
        removeField,
        moveField,
        clearSchema,
        selectForm,
        createForm,
    } = useFormStore();

    function handleClear() {
        if (fields.length === 0 || window.confirm('Clear all fields? This cannot be undone.')) {
            clearSchema();
        }
    }

    // No active form — show a picker / create prompt
    if (!activeFormId) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.header__title}>
                        Dynamic <span>Form Builder</span>
                    </h1>
                    <p className={styles.header__subtitle}>
                        Select an existing form or create a new one to get started.
                    </p>
                </div>
                <div className={styles.emptyState}>
                    <div className={styles.emptyState__icon}>🧩</div>
                    <div className={styles.emptyState__title}>No form selected</div>
                    {formList.length > 0 ? (
                        <p>Go to <strong>My Forms</strong> to open a form, or create a new one.</p>
                    ) : (
                        <p>You haven&apos;t created any forms yet.</p>
                    )}
                    <div className={styles.emptyState__actions}>
                        <button className={styles.btnAdd} onClick={() => navigate('/forms')}>
                            📋 My Forms
                        </button>
                        <button className={styles.btnPreview} onClick={() => createForm() && navigate('/form-builder')}>
                            + New Form
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.header__left}>
                    <button className={styles.btnBack} onClick={() => navigate('/forms')}>
                        ← My Forms
                    </button>
                    <h1 className={styles.header__title}>
                        Dynamic <span>Form Builder</span>
                    </h1>
                    <p className={styles.header__subtitle}>
                        Define fields, choose input types, then preview &amp; submit.
                        Schema is auto-saved to localStorage.
                    </p>
                </div>
            </div>

            {/* Form Title */}
            <div className={styles.titleSection}>
                <span className={styles.titleIcon}>📝</span>
                <input
                    id="form-title-input"
                    type="text"
                    className={styles.titleInput}
                    placeholder="Enter form title…"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                />
            </div>

            {/* Actions */}
            <div className={styles.actionsBar}>
                <button id="add-field-btn" className={styles.btnAdd} onClick={addField}>
                    + Add Field
                </button>
                <button
                    id="preview-form-btn"
                    className={styles.btnPreview}
                    onClick={() => navigate('/form-preview')}
                    disabled={fields.length === 0}
                >
                    👁 Preview Form
                </button>
                <span className={styles.fieldCount}>{fields.length} field{fields.length !== 1 ? 's' : ''}</span>
                {fields.length > 0 && (
                    <button id="clear-fields-btn" className={styles.btnClear} onClick={handleClear}>
                        🗑 Clear All
                    </button>
                )}
            </div>

            {/* Fields */}
            {fields.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyState__icon}>🧩</div>
                    <div className={styles.emptyState__title}>No fields yet</div>
                    <p>Click &ldquo;Add Field&rdquo; to start building your form.</p>
                </div>
            ) : (
                <div className={styles.fieldsList}>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.fieldCardWrapper}>
                            <div className={styles.fieldCard}>
                            {/* Card Header */}
                            <div className={styles.fieldCard__header}>
                                <span className={styles.fieldCard__drag}>
                                    <span /><span /><span />
                                </span>
                                <span className={styles.fieldCard__num}>{index + 1}</span>
                                <span className={`${styles.fieldCard__label} ${field.label ? styles['fieldCard__label--filled'] : ''}`}>
                                    {field.label || 'Untitled Field'}
                                </span>
                                <span className={styles.fieldCard__typeBadge}>{field.type}</span>
                                <div className={styles.fieldCard__actions}>
                                    <button className={styles.iconBtn} onClick={() => moveField(index, -1)} disabled={index === 0} title="Move up">↑</button>
                                    <button className={styles.iconBtn} onClick={() => moveField(index, 1)} disabled={index === fields.length - 1} title="Move down">↓</button>
                                    <button className={`${styles.iconBtn} ${styles['iconBtn--delete']}`} onClick={() => removeField(field.id)} title="Remove field">✕</button>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className={styles.fieldCard__body}>
                                {/* Label */}
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Field Label *</label>
                                    <input
                                        id={`label-${field.id}`}
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g. Full Name"
                                        value={field.label}
                                        onChange={e => updateField(field.id, 'label', e.target.value)}
                                    />
                                </div>

                                {/* Input Type */}
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Input Type *</label>
                                    <select
                                        id={`type-${field.id}`}
                                        className={styles.formSelect}
                                        value={field.type}
                                        onChange={e => updateField(field.id, 'type', e.target.value)}
                                    >
                                        {TYPE_GROUPS.map(group => (
                                            <optgroup key={group} label={group}>
                                                {INPUT_TYPES.filter(t => t.group === group).map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>

                                {/* Placeholder */}
                                {hasPlaceholder(field.type) && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Placeholder</label>
                                        <input
                                            id={`placeholder-${field.id}`}
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. Enter your name"
                                            value={field.placeholder}
                                            onChange={e => updateField(field.id, 'placeholder', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Default Value – button/submit/reset labels */}
                                {['button', 'submit', 'reset', 'image'].includes(field.type) && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            {field.type === 'image' ? 'Image src URL' : 'Button Label'}
                                        </label>
                                        <input
                                            id={`default-${field.id}`}
                                            type="text"
                                            className={styles.formInput}
                                            placeholder={field.type === 'image' ? 'https://…' : 'e.g. Click Me'}
                                            value={field.type === 'image' ? field.src : field.defaultValue}
                                            onChange={e => updateField(field.id, field.type === 'image' ? 'src' : 'defaultValue', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Alt text for image */}
                                {field.type === 'image' && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Alt Text</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. Submit"
                                            value={field.alt}
                                            onChange={e => updateField(field.id, 'alt', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Hidden field value */}
                                {field.type === 'hidden' && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Hidden Value</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="e.g. user_id"
                                            value={field.defaultValue}
                                            onChange={e => updateField(field.id, 'defaultValue', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Textarea rows */}
                                {field.type === 'textarea' && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Rows</label>
                                        <input
                                            type="number"
                                            className={styles.formInput}
                                            min="2"
                                            max="20"
                                            value={field.rows}
                                            onChange={e => updateField(field.id, 'rows', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Range / Number config */}
                                {needsRange(field.type) && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Min</label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                placeholder="e.g. 0"
                                                value={field.min}
                                                onChange={e => updateField(field.id, 'min', e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Max</label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                placeholder="e.g. 100"
                                                value={field.max}
                                                onChange={e => updateField(field.id, 'max', e.target.value)}
                                            />
                                        </div>
                                        {['number', 'range'].includes(field.type) && (
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Step</label>
                                                <input
                                                    type="text"
                                                    className={styles.formInput}
                                                    placeholder="e.g. 1"
                                                    value={field.step}
                                                    onChange={e => updateField(field.id, 'step', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* File: accept + multiple */}
                                {field.type === 'file' && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Accept</label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                placeholder="e.g. image/*,.pdf"
                                                value={field.accept}
                                                onChange={e => updateField(field.id, 'accept', e.target.value)}
                                            />
                                            <span className={styles.hint}>MIME types or extensions, comma-separated</span>
                                        </div>
                                    </>
                                )}

                                {/* Options (select / radio / checkbox) */}
                                {needsOptions(field.type) && (
                                    <div className={`${styles.formGroup} ${styles['formGroup--full']}`}>
                                        <label className={styles.formLabel}>Options</label>
                                        <input
                                            id={`options-${field.id}`}
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="Option 1, Option 2, Option 3"
                                            value={field.options}
                                            onChange={e => updateField(field.id, 'options', e.target.value)}
                                        />
                                        <span className={styles.hint}>Comma-separated list of options</span>
                                    </div>
                                )}

                                {/* Multiple (file & checkbox) */}
                                {['file', 'checkbox'].includes(field.type) && (
                                    <div className={`${styles.formGroup} ${styles['formGroup--full']}`}>
                                        <div className={styles.checkboxRow}>
                                            <input
                                                id={`multiple-${field.id}`}
                                                type="checkbox"
                                                checked={field.multiple}
                                                onChange={e => updateField(field.id, 'multiple', e.target.checked)}
                                            />
                                            <label htmlFor={`multiple-${field.id}`}>Allow multiple selections</label>
                                        </div>
                                    </div>
                                )}

                                {/* Required (not for button types or hidden) */}
                                {!['button', 'submit', 'reset', 'hidden', 'image'].includes(field.type) && (
                                    <div className={`${styles.formGroup} ${styles['formGroup--full']}`}>
                                        <div className={styles.checkboxRow}>
                                            <input
                                                id={`required-${field.id}`}
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={e => updateField(field.id, 'required', e.target.checked)}
                                            />
                                            <label htmlFor={`required-${field.id}`}>Mark as required field</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>{/* /fieldCard */}

                            {/* Inline + Add Field button after each card */}
                            <div className={styles.inlineAdd}>
                                <button
                                    className={styles.inlineAddBtn}
                                    onClick={addField}
                                    title="Add a new field"
                                >
                                    <span className={styles.inlineAddLine} />
                                    <span className={styles.inlineAddIcon}>+</span>
                                    <span className={styles.inlineAddLine} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
