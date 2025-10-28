/**
 * Tag Categories Configuration
 * Defines the categorization system for test tags
 */

export interface TagCategory {
    color: string;
    icon: string;
    description: string;
}

export interface TagMeta {
    category: string;
    color: string;
    icon: string;
}

export const TagCategories: Record<string, string[]> = {
    priority: ['smoke', 'critical', 'regression', 'low-priority', 'high-priority', 'medium-priority'],
    type: ['e2e', 'api', 'visual', 'unit', 'integration', 'component'],
    area: ['ui', 'backend', 'database', 'auth', 'booking', 'admin', 'contact', 'room', 'report', 'login', 'logout'],
    status: ['todo', 'wip', 'skip', 'blocked', 'bug', 'fix'],
    environment: ['local', 'staging', 'production', 'dev'],
    feature: ['booking', 'authentication', 'admin', 'reports', 'contact-form']
};

export const CategoryMeta: Record<string, TagCategory> = {
    priority: { color: '#3498db', icon: 'priority', description: 'Test priority level' },
    type: { color: '#9b59b6', icon: 'category', description: 'Test type classification' },
    area: { color: '#e67e22', icon: 'place', description: 'Functional area or module' },
    status: { color: '#7f8c8d', icon: 'flag', description: 'Test development status' },
    environment: { color: '#16a085', icon: 'public', description: 'Target environment' },
    feature: { color: '#e74c3c', icon: 'star', description: 'Feature or capability being tested' }
};

/**
 * Tag validation rules
 */
export interface TagValidationRules {
    minLength: number;
    maxLength: number;
    allowedChars: RegExp;
    requiredPrefix: string | null;
    caseSensitive: boolean;
}

export const tagValidationRules: TagValidationRules = {
    minLength: 2,
    maxLength: 50,
    allowedChars: /^[a-zA-Z0-9_-]+$/,
    requiredPrefix: null, // '@' is optional but normalized
    caseSensitive: false
};

/**
 * Get category for a tag
 */
export function getTagCategory(tag: string): string | null {
    const normalizedTag = tag.toLowerCase();
    
    for (const [category, tags] of Object.entries(TagCategories)) {
        if (tags.includes(normalizedTag)) {
            return category;
        }
    }
    
    return null; // Uncategorized tag
}

/**
 * Get metadata for a tag
 */
export function getTagMeta(tag: string): TagMeta {
    const category = getTagCategory(tag);
    const defaultMeta = { color: '#95a5a6', icon: 'label', description: 'Uncategorized tag' };
    
    if (category && CategoryMeta[category]) {
        return {
            category,
            color: CategoryMeta[category].color,
            icon: CategoryMeta[category].icon
        };
    }
    
    return {
        category: 'uncategorized',
        color: defaultMeta.color,
        icon: defaultMeta.icon
    };
}

/**
 * Validate a tag
 */
export function validateTag(tag: string): { valid: boolean; error?: string } {
    if (!tag || tag.trim().length === 0) {
        return { valid: false, error: 'Tag cannot be empty' };
    }
    
    const trimmed = tag.trim();
    
    if (trimmed.length < tagValidationRules.minLength) {
        return { valid: false, error: `Tag must be at least ${tagValidationRules.minLength} characters` };
    }
    
    if (trimmed.length > tagValidationRules.maxLength) {
        return { valid: false, error: `Tag must be no more than ${tagValidationRules.maxLength} characters` };
    }
    
    if (!tagValidationRules.allowedChars.test(trimmed)) {
        return { valid: false, error: 'Tag can only contain letters, numbers, hyphens, and underscores' };
    }
    
    if (tagValidationRules.requiredPrefix && !trimmed.startsWith(tagValidationRules.requiredPrefix)) {
        return { valid: false, error: `Tag must start with '${tagValidationRules.requiredPrefix}'` };
    }
    
    return { valid: true };
}

/**
 * Get all categories as a flat list for display
 */
export function getAllTags(): string[] {
    const allTags: string[] = [];
    Object.values(TagCategories).forEach(categoryTags => {
        allTags.push(...categoryTags);
    });
    return Array.from(new Set(allTags)).sort();
}

/**
 * Check if a tag is in a specific category
 */
export function isTagInCategory(tag: string, category: string): boolean {
    const normalizedTag = tag.toLowerCase();
    const categoryTags = TagCategories[category];
    return categoryTags ? categoryTags.includes(normalizedTag) : false;
}

