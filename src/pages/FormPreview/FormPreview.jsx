import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import styles from './FormPreview.module.css';

// ── Field renderer ────────────────────────────────────────────────────────────
function renderField(field, value, onChange) {
    const opts = field.options
        ? field.options.split(',').map(o => o.trim()).filter(Boolean)
        : [];

    const commonProps = {
        id: `preview-${field.id}`,
        required: field.required,
    };

    switch (field.type) {
        // ── textarea ──────────────────────────────────────────────────────────
        case 'textarea':
            return (
                <textarea
                    {...commonProps}
                    className={styles.fieldTextarea}
                    placeholder={field.placeholder}
                    rows={parseInt(field.rows) || 4}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                />
            );

        // ── select dropdown ───────────────────────────────────────────────────
        case 'select':
            return (
                <select
                    {...commonProps}
                    className={styles.fieldSelect}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                >
                    <option value="">-- Select an option --</option>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            );

        // ── radio ─────────────────────────────────────────────────────────────
        case 'radio':
            return (
                <div className={styles.optionsGroup}>
                    {opts.map(o => (
                        <div key={o} className={styles.optionItem}>
                            <input
                                type="radio"
                                id={`preview-${field.id}-${o}`}
                                name={`preview-${field.id}`}
                                value={o}
                                checked={value === o}
                                onChange={() => onChange(o)}
                                required={field.required}
                            />
                            <label htmlFor={`preview-${field.id}-${o}`}>{o}</label>
                        </div>
                    ))}
                </div>
            );

        // ── checkbox (multi-select) ───────────────────────────────────────────
        case 'checkbox': {
            const checked = Array.isArray(value) ? value : [];
            return (
                <div className={styles.optionsGroup}>
                    {opts.map(o => (
                        <div key={o} className={styles.optionItem}>
                            <input
                                type="checkbox"
                                id={`preview-${field.id}-${o}`}
                                value={o}
                                checked={checked.includes(o)}
                                onChange={e => {
                                    if (e.target.checked) onChange([...checked, o]);
                                    else onChange(checked.filter(c => c !== o));
                                }}
                            />
                            <label htmlFor={`preview-${field.id}-${o}`}>{o}</label>
                        </div>
                    ))}
                </div>
            );
        }

        // ── range slider ──────────────────────────────────────────────────────
        case 'range': {
            const rangeVal = value ?? field.min ?? '50';
            return (
                <div className={styles.rangeWrapper}>
                    <input
                        {...commonProps}
                        type="range"
                        className={styles.fieldRange}
                        min={field.min || 0}
                        max={field.max || 100}
                        step={field.step || 1}
                        value={rangeVal}
                        onChange={e => onChange(e.target.value)}
                    />
                    <span className={styles.rangeValue}>{rangeVal}</span>
                </div>
            );
        }

        // ── color picker ──────────────────────────────────────────────────────
        case 'color':
            return (
                <div className={styles.colorWrapper}>
                    <input
                        {...commonProps}
                        type="color"
                        className={styles.fieldColor}
                        value={value || '#6c63ff'}
                        onChange={e => onChange(e.target.value)}
                    />
                    <span className={styles.colorValue}>{value || '#6c63ff'}</span>
                </div>
            );

        // ── file ──────────────────────────────────────────────────────────────
        case 'file':
            return (
                <input
                    {...commonProps}
                    type="file"
                    className={styles.fieldFile}
                    accept={field.accept || undefined}
                    multiple={field.multiple}
                    onChange={e => {
                        const files = e.target.files;
                        onChange(files ? Array.from(files).map(f => f.name).join(', ') : '');
                    }}
                />
            );

        // ── hidden ────────────────────────────────────────────────────────────
        case 'hidden':
            return (
                <div className={styles.hiddenInfo}>
                    <span className={styles.hiddenBadge}>hidden</span>
                    <span className={styles.hiddenVal}>{field.defaultValue || '(empty)'}</span>
                    <span className={styles.hiddenNote}>Not visible in the final form</span>
                </div>
            );

        // ── image button ──────────────────────────────────────────────────────
        case 'image':
            return (
                <input
                    {...commonProps}
                    type="image"
                    src={field.src || 'https://placehold.co/120x40?text=Submit'}
                    alt={field.alt || 'Submit'}
                    className={styles.fieldImage}
                />
            );

        // ── button / submit / reset ───────────────────────────────────────────
        case 'button':
            return (
                <button type="button" className={styles.fieldButton}>
                    {field.defaultValue || field.label || 'Button'}
                </button>
            );
        case 'submit':
            return (
                <button type="submit" className={styles.fieldButtonSubmit}>
                    {field.defaultValue || field.label || 'Submit'}
                </button>
            );
        case 'reset':
            return (
                <button type="reset" className={styles.fieldButtonReset}>
                    {field.defaultValue || field.label || 'Reset'}
                </button>
            );

        // ── default: all remaining <input> types ──────────────────────────────
        default:
            return (
                <input
                    {...commonProps}
                    type={field.type}
                    className={styles.fieldInput}
                    placeholder={field.placeholder}
                    min={field.min || undefined}
                    max={field.max || undefined}
                    step={field.step || undefined}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                />
            );
    }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FormPreview() {
    const navigate = useNavigate();
    const { fields, formTitle, activeFormId } = useFormStore();
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    function handleChange(id, value) {
        setFormData(prev => ({ ...prev, [id]: value }));
        if (submitted) setSubmitted(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const result = {};
        fields.forEach(f => {
            if (['button', 'submit', 'reset', 'image'].includes(f.type)) return;
            const label = f.label || `Field ${f.id}`;
            const val = formData[f.id];
            result[label] = Array.isArray(val) ? val.join(', ') : (val ?? '');
        });
        console.log('=== Form Submitted ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('=====================');
        setSubmittedData(result);
        setSubmitted(true);
    }

    function handleReset() {
        setFormData({});
        setSubmitted(false);
        setSubmittedData(null);
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.header__left}>
                    <h1 className={styles.header__title}>
                        Form <span>Preview</span>
                    </h1>
                    <p className={styles.header__subtitle}>
                        Fill in the form below and submit. Data is printed to the console.
                    </p>
                </div>
                <button
                    id="back-to-builder"
                    className={styles.btnBack}
                    onClick={() => navigate('/form-builder')}
                >
                    ← Back to Builder
                </button>
            </div>

            {/* Empty state */}
            {fields.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyState__icon}>🧩</div>
                    <div className={styles.emptyState__title}>No form schema found</div>
                    <p>Go to the Form Builder and add some fields first.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                        <button id="go-to-builder" className={styles.btnGoBuilder} onClick={() => navigate('/form-builder')}>
                            Open Form Builder →
                        </button>
                        <button className={styles.btnGoBuilder} style={{ background: 'var(--color-surface2)', color: 'var(--color-text-muted)', boxShadow: 'none', border: '1px solid var(--color-border)' }} onClick={() => navigate('/forms')}>
                            My Forms
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Success banner */}
                    {submitted && submittedData && (
                        <div className={styles.successBanner}>
                            <span className={styles.successBanner__icon}>🎉</span>
                            <div className={styles.successBanner__text}>
                                <div className={styles.successBanner__title}>Form submitted successfully!</div>
                                <div className={styles.successBanner__hint}>Data has been printed to the browser console (F12 → Console).</div>
                                <table className={styles.dataTable}>
                                    <tbody>
                                        {Object.entries(submittedData).map(([k, v]) => (
                                            <tr key={k}>
                                                <td>{k}</td>
                                                <td>{v || <em style={{ color: 'var(--color-text-muted)' }}>empty</em>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Form card */}
                    <div className={styles.formCard}>
                        <div className={styles.formCard__header}>
                            <div className={styles.formCard__title}>{formTitle}</div>
                            <div className={styles.formCard__meta}>{fields.length} field{fields.length !== 1 ? 's' : ''}</div>
                        </div>

                        <form onSubmit={handleSubmit} onReset={handleReset}>
                            <div className={styles.formCard__body}>
                                {fields.map(field => (
                                    <div key={field.id} className={styles.formField}>
                                        {/* Hide label for pure button types */}
                                        {!['button', 'submit', 'reset'].includes(field.type) && (
                                            <label className={styles.fieldLabel} htmlFor={`preview-${field.id}`}>
                                                {field.label || 'Untitled Field'}
                                                {field.required && <span className={styles.required}>*</span>}
                                                {field.type === 'hidden' && (
                                                    <span className={styles.hiddenLabel}> (hidden)</span>
                                                )}
                                            </label>
                                        )}
                                        {renderField(field, formData[field.id], (val) => handleChange(field.id, val))}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.formCard__footer}>
                                <button id="submit-form-btn" type="submit" className={styles.btnSubmit}>
                                    ✓ Submit Form
                                </button>
                                <button id="reset-form-btn" type="button" className={styles.btnReset} onClick={handleReset}>
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
