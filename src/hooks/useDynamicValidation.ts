import { useState, useEffect } from 'react';
import { z } from 'zod';

type SchemaName = 'course' | 'user' | 'payment';

/**
 * Hook for dynamically loading Zod validation schemas
 * This reduces initial bundle size by loading validation schemas on demand
 */
export function useDynamicValidation<T>(schemaName: SchemaName) {
  const [schema, setSchema] = useState<z.ZodType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        setIsLoading(true);
        let loadedSchema;

        switch (schemaName) {
          case 'course':
            loadedSchema = await import('../validations/courseSchema');
            break;
          case 'user':
            // Will be implemented later
            loadedSchema = { default: z.object({}) };
            break;
          case 'payment':
            // Will be implemented later
            loadedSchema = { default: z.object({}) };
            break;
          default:
            throw new Error(`Unknown schema: ${schemaName}`);
        }

        setSchema(loadedSchema.default as z.ZodType<T>);
        setError(null);
      } catch (err) {
        console.error(`Error loading schema ${schemaName}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to load validation schema'));
        setSchema(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchema();
  }, [schemaName]);

  return { schema, isLoading, error };
}

export default useDynamicValidation; 