/**
 * SnippetForm component for creating new snippets
 * MVP version - handles only title and content fields
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateTitle, validateContent } from '../../utils/snippet-validators';
import type { SnippetFormData, SnippetFormErrors } from '../../types/snippet';

interface SnippetFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function SnippetForm({ onSuccess, onError }: SnippetFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<SnippetFormData>({
        title: '',
        content: ''
    });
    const [errors, setErrors] = useState<SnippetFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Validates a single field and updates errors
     */
    const validateField = (field: keyof SnippetFormData, value: string) => {
        let error: string | undefined;

        if (field === 'title') {
            const validationError = validateTitle(value);
            error = validationError?.message;
        } else if (field === 'content') {
            const validationError = validateContent(value);
            error = validationError?.message;
        }

        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    /**
     * Handles input field changes
     */
    const handleInputChange = (field: keyof SnippetFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Handles field blur events (triggers validation)
     */
    const handleFieldBlur = (field: keyof SnippetFormData) => {
        validateField(field, formData[field]);
    };

    /**
     * Checks if form has any validation errors
     */
    const hasErrors = () => {
        return Object.values(errors).some(error => error !== undefined);
    };

    /**
     * Validates all fields
     */
    const validateAllFields = () => {
        validateField('title', formData.title);
        validateField('content', formData.content);
    };

    /**
     * Handles form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        validateAllFields();

        // Check for validation errors
        if (hasErrors()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/snippets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create snippet');
            }

            // Success - redirect to home page
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create snippet';
            if (onError) {
                onError(errorMessage);
            } else {
                console.error('Error creating snippet:', error);
                // TODO: Show error message in UI
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="snippet-form">
            <div className="form-group">
                <label htmlFor="title" className="form-label">
                    Title *
                </label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    onBlur={() => handleFieldBlur('title')}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter a descriptive title for your snippet"
                    disabled={isSubmitting}
                    maxLength={100}
                />
                {errors.title && (
                    <div className="error-message" role="alert">
                        {errors.title}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="content" className="form-label">
                    Code Content *
                </label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    onBlur={() => handleFieldBlur('content')}
                    className={`form-textarea ${errors.content ? 'error' : ''}`}
                    placeholder="Paste your code snippet here..."
                    disabled={isSubmitting}
                    rows={15}
                    maxLength={50000}
                />
                {errors.content && (
                    <div className="error-message" role="alert">
                        {errors.content}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    disabled={isSubmitting || hasErrors()}
                    className="btn btn-primary"
                >
                    {isSubmitting ? 'Creating...' : 'Create Snippet'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/')}
                    disabled={isSubmitting}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}