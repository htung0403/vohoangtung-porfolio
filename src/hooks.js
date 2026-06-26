import { useState, useEffect, useRef, useCallback } from 'react';

/* ===== Typewriter ===== */
export function useTypewriter(words, typingSpeed = 80, deletingSpeed = 40, pause = 2000) {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = words[wordIndex];
        let timeout;
        if (!isDeleting && text === current) {
            timeout = setTimeout(() => setIsDeleting(true), pause);
        } else if (isDeleting && text === '') {
            setIsDeleting(false);
            setWordIndex((i) => (i + 1) % words.length);
        } else {
            timeout = setTimeout(() => {
                setText(isDeleting ? current.substring(0, text.length - 1) : current.substring(0, text.length + 1));
            }, isDeleting ? deletingSpeed : typingSpeed);
        }
        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

    return text;
}

/* ===== Scroll progress ===== */
export function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return progress;
}

/* ===== Section observer (active nav + fade-in) ===== */
export function useSectionObserver(sectionIds) {
    const [active, setActive] = useState('');
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sectionIds]);
    return active;
}

/* ===== Fade-in on scroll ===== */
export function useFadeObserver() {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
            },
            { threshold: 0.15 }
        );
        const el = ref.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, []);
    return ref;
}

/* ===== Skill bar observer ===== */
export function useSkillBarObserver() {
    const ref = useRef(null);
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
            { threshold: 0.3 }
        );
        const el = ref.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, []);
    return [ref, animated];
}

/* ===== Timeline height observer ===== */
export function useTimelineObserver() {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const container = ref.current;
                    if (container) setHeight(container.scrollHeight);
                }
            },
            { threshold: 0.1 }
        );
        const el = ref.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, []);
    return [ref, height];
}

/* ===== 3D tilt (project card) ===== */
export function useTilt() {
    const ref = useRef(null);
    const handleMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    }, []);
    const handleLeave = useCallback(() => {
        if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    }, []);
    return { ref, handleMove, handleLeave };
}

/* ===== Toast ===== */
export function useToast() {
    const [msg, setMsg] = useState('');
    const [show, setShow] = useState(false);
    const copy = useCallback((text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setMsg(`${label} copied!`);
            setShow(true);
            setTimeout(() => setShow(false), 2000);
        });
    }, []);
    return { msg, show, copy };
}

/* ===== Magnetic Effect ===== */
export function useMagnetic(strength = 20) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const moveX = (e.clientX - centerX) * (strength / (width / 2));
            const moveY = (e.clientY - centerY) * (strength / (height / 2));

            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        const handleMouseLeave = () => {
            el.style.transform = `translate(0px, 0px)`;
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return ref;
}
