
import './index.css';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Truck,
    RefreshCw,
    ShieldCheck,
    Monitor,
    CreditCard,
    Wrench,
    FileText,
    ChevronDown,
    Mail,
    MessageSquare,
    Bot
} from 'lucide-react';

import { Icon } from '@pixelforge/icon';

const supportCategories = [
    {
        name: 'Orders & Delivery',
        description: 'Track your order, delivery times, and shipping information.',
        icon: Truck
    },
    {
        name: 'Returns & Refunds',
        description: 'How to return products and what to expect from the process.',
        icon: RefreshCw
    },
    {
        name: 'Warranty & Privacy',
        description: 'Understand your warranty coverage and privacy rights.',
        icon: ShieldCheck
    },
    {
        name: 'Products & Compatibility',
        description: 'Find compatibility information and compare specifications.',
        icon: Monitor
    },
    {
        name: 'Payments',
        description: 'Payment methods, invoices, and billing questions.',
        icon: CreditCard
    },
    {
        name: 'Technical Support',
        description: 'Troubleshooting guides for hardware and software issues.',
        icon: Wrench
    }
];

export const SupportPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchDocuments = async () => {
            try {
                const response = await fetch(
                    'https://santosnr6.github.io/Data/pixelforgedocuments.json',
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Invalid document data');
                }

                if (!controller.signal.aborted) {
                    setDocuments(data);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchDocuments();

        return () => controller.abort();
    }, []);

    return (
        <main className="support-page">
            <header className="support-page__hero">
                <div className="wrapper">
                    <h1>How can we help?</h1>
                    <p>
                        Find answers to common questions in our knowledge base.
                    </p>
                </div>
            </header>

            <section className="support-page__content wrapper">
                <h2>Browse support topics</h2>

                {loading && (
                    <p className="support-page__status">
                        Loading support articles...
                    </p>
                )}

                {error && (
                    <p className="support-page__status" role="alert">
                        Could not load support articles: {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="support-page__categories">
                        {supportCategories.map(category => {
                            const categoryDocuments = documents.filter(
                                document => document.category === category.name
                            );

                            return (
                                <details
                                    key={category.name}
                                    className="support-page__category"
                                >
                                    <summary className="support-page__category-header">
                                        <span className="support-page__category-icon">
                                            <Icon
                                                icon={category.icon}
                                                size={21}
                                            />
                                        </span>

                                        <span className="support-page__category-info">
                                            <strong>{category.name}</strong>

                                            <span className="support-page__category-description">
                                                {category.description}
                                            </span>

                                            <span className="support-page__category-count">
                                                {categoryDocuments.length} articles
                                                <Icon icon={ChevronDown} size={13} />
                                            </span>
                                        </span>
                                    </summary>

                                    <ul className="support-page__documents">
                                        {categoryDocuments.map(document => (
                                            <li key={document.id}>
                                                <Link to={`/support/${document.slug}`}>
                                                    <Icon icon={FileText} size={16} />
                                                    <span>{document.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="support-page__contact">
                <div className="wrapper">
                    <header className="support-page__contact-header">
                        <h2>Still need help?</h2>
                        <p>Our team is ready to assist you.</p>
                    </header>

                    <div className="support-page__contact-grid">
                        <a
                            className="support-page__contact-card"
                            href="mailto:support@pixelforge.example"
                        >
                            <span className="support-page__contact-icon">
                                <Icon icon={Mail} size={20} />
                            </span>

                            <strong>Email</strong>
                            <span className="support-page__contact-link">
                                support@pixelforge.example
                            </span>
                            <small>Response within 2 business days</small>
                        </a>

                        <div className="support-page__contact-card">
                            <span className="support-page__contact-icon">
                                <Icon icon={MessageSquare} size={20} />
                            </span>

                            <strong>Contact form</strong>
                            <span className="support-page__contact-link">
                                Send us a message
                            </span>
                            <small>Mon–Fri 09:00–17:00</small>
                        </div>

                        <div className="support-page__contact-card">
                            <span className="support-page__contact-icon">
                                <Icon icon={Bot} size={20} />
                            </span>

                            <strong>AI assistant</strong>
                            <span className="support-page__contact-link">
                                Chat with our AI
                            </span>
                            <small>Available 24/7</small>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
