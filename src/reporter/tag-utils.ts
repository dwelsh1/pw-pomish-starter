/**
 * Tag Utility Functions
 * Provides utility functions for tag processing and display
 */

import { getTagMeta, validateTag, getTagCategory } from './tag-config';

export interface NormalizedTag {
    original: string;
    normalized: string;
    category: string | null;
    color: string;
    icon: string;
    valid: boolean;
    error?: string;
}

/**
 * Normalize a tag (remove @ prefix and trim)
 */
export function normalizeTag(tag: string): string {
    return tag.replace(/^@/, '').trim();
}

/**
 * Process tags: normalize, validate, and enrich with metadata
 */
export function processTags(tags: string[]): NormalizedTag[] {
    return tags.map(tag => {
        const normalized = normalizeTag(tag);
        const validation = validateTag(normalized);
        const meta = getTagMeta(normalized);
        const category = getTagCategory(normalized);
        
        return {
            original: tag,
            normalized: normalized,
            category: category,
            color: meta.color,
            icon: meta.icon,
            valid: validation.valid,
            error: validation.error
        };
    });
}

/**
 * Group tags by category
 */
export function groupTagsByCategory(tags: NormalizedTag[]): Record<string, NormalizedTag[]> {
    const grouped: Record<string, NormalizedTag[]> = {
        uncategorized: []
    };
    
    tags.forEach(tag => {
        if (tag.category) {
            if (!grouped[tag.category]) {
                grouped[tag.category] = [];
            }
            grouped[tag.category].push(tag);
        } else {
            grouped.uncategorized.push(tag);
        }
    });
    
    return grouped;
}

/**
 * Get unique tags from all tests
 */
export function getUniqueTags(tags: string[]): string[] {
    return Array.from(new Set(tags.map(tag => normalizeTag(tag)))).sort();
}

/**
 * Filter tags by category
 */
export function filterTagsByCategory(tags: NormalizedTag[], category: string): NormalizedTag[] {
    return tags.filter(tag => tag.category === category);
}

/**
 * Generate CSS for tag badge
 */
export function getTagBadgeCSS(color: string): string {
    return `
        background-color: ${color}15;
        color: ${color};
        border: 1px solid ${color}40;
    `;
}

/**
 * Get tag count statistics
 */
export interface TagStats {
    total: number;
    byCategory: Record<string, number>;
    invalid: number;
}

export function getTagStats(allTags: NormalizedTag[]): TagStats {
    const stats: TagStats = {
        total: allTags.length,
        byCategory: {},
        invalid: 0
    };
    
    allTags.forEach(tag => {
        if (!tag.valid) {
            stats.invalid++;
        } else if (tag.category) {
            stats.byCategory[tag.category] = (stats.byCategory[tag.category] || 0) + 1;
        } else {
            stats.byCategory['uncategorized'] = (stats.byCategory['uncategorized'] || 0) + 1;
        }
    });
    
    return stats;
}

/**
 * Check if any tags are invalid and return warnings
 */
export function getTagWarnings(processedTags: NormalizedTag[]): string[] {
    const warnings: string[] = [];
    
    processedTags.forEach(tag => {
        if (!tag.valid && tag.error) {
            warnings.push(`Invalid tag "${tag.original}": ${tag.error}`);
        }
    });
    
    return warnings;
}

/**
 * Format tag for display with category badge
 */
export interface FormattedTag {
    name: string;
    category: string | null;
    color: string;
    icon: string;
}

export function formatTagForDisplay(tag: string): FormattedTag {
    const normalized = normalizeTag(tag);
    const meta = getTagMeta(normalized);
    const category = getTagCategory(normalized);
    
    return {
        name: normalized,
        category: category,
        color: meta.color,
        icon: meta.icon
    };
}

/**
 * Sort tags by category priority and then alphabetically
 */
export function sortTagsByCategory(processedTags: NormalizedTag[]): NormalizedTag[] {
    const categoryPriority: Record<string, number> = {
        'priority': 1,
        'type': 2,
        'area': 3,
        'feature': 4,
        'environment': 5,
        'status': 6,
        'uncategorized': 7
    };
    
    return [...processedTags].sort((a, b) => {
        const aCat = a.category || 'uncategorized';
        const bCat = b.category || 'uncategorized';
        
        const aPriority = categoryPriority[aCat] || 999;
        const bPriority = categoryPriority[bCat] || 999;
        
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }
        
        return a.normalized.localeCompare(b.normalized);
    });
}

