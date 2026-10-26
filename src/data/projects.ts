import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    slug: 'cockatiel-recognition',
    title: 'A Vision System That Tells Cockatiels Apart',
    summary: 'Real-time image classification system using Raspberry Pi, OpenCV and SqueezeNet CNN.',
    year: 2025,
    tags: ['python', 'opencv', 'pytorch', 'raspberry-pi', 'cnn', 'squeezenet'],
    links: { paper: 'https://ebooks.iospress.nl/doi/10.3233/ATDE251126' },
    featured: true,
  },
  {
    slug: 'buriccat',
    title: 'Buriccat',
    summary: 'A 3D Baccarat game in the browser, a fun project to try out React Three Fiber.',
    year: 2026,
    tags: ['react', 'react-three-fiber', 'gsap', 'game'],
    links: { repo: 'https://github.com/saaquiteles/baccarat' },
    featured: true,
  },
];
