import {
    MonitorCog,
    Cpu,
    Monitor,
    Keyboard,
    Mouse,
    Headphones
} from 'lucide-react';

export const categories = [
    {
        name: 'Gaming PCs',
        slug: 'gaming-pcs',
        description: 'Ready-to-play builds',
        icon: MonitorCog
    },
    {
        name: 'Components',
        slug: 'components',
        description: 'GPUs, CPUs & more',
        icon: Cpu
    },
    {
        name: 'Monitors',
        slug: 'monitors',
        description: 'High-refresh displays',
        icon: Monitor
    },
    {
        name: 'Keyboards',
        slug: 'keyboards',
        description: 'Mechanical precision',
        icon: Keyboard
    },
    {
        name: 'Mice',
        slug: 'mice',
        description: 'Precision sensors',
        icon: Mouse
    },
    {
        name: 'Headsets',
        slug: 'headsets',
        description: 'Immersive audio',
        icon: Headphones
    }
];