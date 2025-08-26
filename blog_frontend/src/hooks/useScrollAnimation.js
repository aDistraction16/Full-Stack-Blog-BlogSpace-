import { useEffect } from 'react';

/**
 * Custom hook that provides scroll-based animation functionality using Intersection Observer API.
 * Automatically adds 'active' class to elements with 'scroll-reveal' class when they come into view.
 * 
 * @function useScrollAnimation
 * @returns {void} This hook doesn't return any value, it sets up side effects for scroll animations
 * 
 * @description
 * - Observes all elements with the 'scroll-reveal' class
 * - Adds 'active' class when elements intersect with the viewport
 * - Uses a threshold of 0.1 (10% of element must be visible)
 * - Applies a bottom margin of 50px before triggering the animation
 * - Automatically cleans up observers when component unmounts
 * 
 * @example
 * // Usage in a React component
 * import { useScrollAnimation } from './hooks/useScrollAnimation';
 * 
 * function MyComponent() {
 *   useScrollAnimation();
 *   
 *   return (
 *     <div className="scroll-reveal">
 *       This element will get 'active' class when scrolled into view
 *     </div>
 *   );
 * }
 * 
 * @requires useEffect - React hook for side effects
 * @requires IntersectionObserver - Web API for observing element visibility changes
 */
export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
};