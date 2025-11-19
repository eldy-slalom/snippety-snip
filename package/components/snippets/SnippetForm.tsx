/**
 * SnippetForm component for creating new snippets
 * Includes title, content, and tags fields
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGE_OPTIONS } from "@/constants/languages";
import {
    validateTitle,
    validateContent,
    validateLanguage,
    validateTags,
} from "../../utils/snippet-validators";
import TagInput from "./TagInput";
import type {
    ApiErrorResponse,
    SnippetFormData,
    SnippetFormErrors,
    ValidationError,
} from "../../types/snippet";

interface SnippetFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function SnippetForm({ onSuccess, onError }: SnippetFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<SnippetFormData>({
        title: "",
        content: "",
        language: "",
        tags: [],
    });
    const [errors, setErrors] = useState<SnippetFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Validates a single field and updates errors
     * Returns the error message if validation fails
     */
    const validateField = (field: keyof SnippetFormData, value: string | string[]): string | undefined => {
        let error: string | undefined;

        if (field === "title" && typeof value === "string") {
            const validationError = validateTitle(value);
            error = validationError?.message;
        } else if (field === "content" && typeof value === "string") {
            const validationError = validateContent(value);
            error = validationError?.message;
        } else if (field === "language" && typeof value === "string") {
            const validationError = validateLanguage(value);
            error = validationError?.message;
        } else if (field === "tags" && Array.isArray(value)) {
            const validationError = validateTags(value);
            error = validationError?.message;
        }

        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        return error;
    };

    /**
     * Handles input field changes
     */
    const handleInputChange = (field: keyof SnippetFormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === "language" && typeof value === "string") {
            const validationError = validateLanguage(value);
            setErrors(prev => ({
                ...prev,
                language: validationError?.message,
            }));
        }
    };

    /**
     * Handles field blur events (triggers validation)
     */
    const handleFieldBlur = (field: keyof SnippetFormData) => {
        validateField(field, formData[field]);
    };

    /**
     * Handles tag changes
     */
    const handleTagsChange = (newTags: string[]) => {
        handleInputChange("tags", newTags);
        validateField("tags", newTags);
    };

    /**
     * Checks if form has any validation errors
     */
    const hasErrors = () => {
        if (!formData.language) {
            return true;
        }

        if (!formData.tags || formData.tags.length === 0) {
            return true;
        }

        return Object.values(errors).some(error => error !== undefined);
    };

    /**
     * Validates all fields and returns true if there are errors
     */
    const validateAllFields = (): boolean => {
        const titleError = validateField("title", formData.title);
        const contentError = validateField("content", formData.content);
        const languageError = validateField("language", formData.language);
        const tagsError = validateField("tags", formData.tags);

        return !!(titleError || contentError || languageError || tagsError);
    };

    /**
     * Handles form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields and check for errors
        const hasValidationErrors = validateAllFields();

        // Check for validation errors
        if (hasValidationErrors) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/snippets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = (await response.json()) as Partial<ApiErrorResponse>;

                let errorMessage = errorData.error ?? "Failed to create snippet";

                if (Array.isArray(errorData.details) && errorData.details.length > 0) {
                    const detailMessages = errorData.details
                        .map((detail: ValidationError) => detail.message)
                        .filter((message): message is string => Boolean(message));

                    if (detailMessages.length > 0) {
                        errorMessage = `${errorMessage}: ${detailMessages.join(", ")}`;
                    }
                }

                throw new Error(errorMessage);
            }

            // Success - redirect to home page
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/");
            }

        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to create snippet";
            if (onError) {
                onError(errorMessage);
            } else {
                console.error("Error creating snippet:", error);
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
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    onBlur={() => handleFieldBlur("title")}
                    className={`form-input ${errors.title ? "error" : ""}`}
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
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    onBlur={() => handleFieldBlur("content")}
                    className={`form-textarea ${errors.content ? "error" : ""}`}
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

            <div className="form-group">
                <label htmlFor="language" className="form-label">
                    Language *
                </label>
                <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    onBlur={() => handleFieldBlur("language")}
                    className={`form-select ${errors.language ? "error" : ""}`}
                    disabled={isSubmitting}
                >
                    <option value="" disabled>
                        Select a language
                    </option>
                    {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.language && (
                    <div className="error-message" role="alert">
                        {errors.language}
                    </div>
                )}
            </div>

            <div className="form-group">
                <TagInput
                    tags={formData.tags}
                    onChange={handleTagsChange}
                />
                {errors.tags && (
                    <div className="error-message" role="alert">
                        {errors.tags}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    disabled={isSubmitting || hasErrors()}
                    className="btn btn-primary"
                >
                    {isSubmitting ? "Creating..." : "Create Snippet"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    disabled={isSubmitting}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}