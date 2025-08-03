import { lazy } from 'react';

// Use lazy loading for the CourseCurriculum component
export const LazyCourseCurriculum = lazy(() => import('./CourseCurriculum'));

// Export types and constants directly for TypeScript support
export * from './types';
export * from './constants';

// Re-export named exports for backward compatibility
export { CourseCurriculum } from './CourseCurriculum'; 