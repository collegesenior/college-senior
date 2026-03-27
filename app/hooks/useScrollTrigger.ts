'use client';
import { useState, useEffect } from 'react';

export function useScrollTrigger(threshold: number = 0.7) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already submitted a form in this session
    const hasSubmitted = sessionStorage.getItem('enquiry_submitted');
    if (hasSubmitted) {
      return; // Don't trigger if already submitted
    }

    // Check if already triggered in this session
    const alreadyTriggered = sessionStorage.getItem('scroll_triggered');
    if (alreadyTriggered) {
      return; // Don't trigger again
    }

    const handleScroll = () => {
      if (hasShown) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = scrollPosition / scrollHeight;

      if (scrollPercentage >= threshold) {
        setIsTriggered(true);
        setHasShown(true);
        sessionStorage.setItem('scroll_triggered', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, hasShown]);

  return { isTriggered, resetTrigger: () => setHasShown(false) };
}

// Function to mark enquiry as submitted
export const markEnquirySubmitted = () => {
  sessionStorage.setItem('enquiry_submitted', 'true');
};

// Function to check if enquiry was submitted
export const hasSubmittedEnquiry = () => {
  return sessionStorage.getItem('enquiry_submitted') === 'true';
};
