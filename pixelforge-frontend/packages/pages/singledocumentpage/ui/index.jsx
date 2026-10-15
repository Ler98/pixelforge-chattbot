
import './index.css';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, FileText } from 'lucide-react';
import { Icon } from '@pixelforge/icon';

export const SingleDocumentPage = () => {
    const { slug } = useParams();

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchDocument = async () => {
            setLoading(true);
            setError(null);
            setDocument(null);

            try {
                const response = await fetch(
                    'https://santosnr6.github.io/Data/pixelforgedocuments.json',
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch document');
                }

                const documents = await response.json();

                console.log('URL slug:', slug);
                console.log('Documents:', documents);       
                console.log('Available slugs:', documents.map(doc => doc.slug));

                if (!Array.isArray(documents)) {
                    throw new Error('Invalid document data');
                }

                const foundDocument = documents.find(
                    item => item.slug === slug
                );

                if (!controller.signal.aborted) {
                    setDocument(foundDocument || null);
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

        fetchDocument();

        return () => controller.abort();
    }, [slug]);

    return (
        <main className="single-document-page wrapper">
            <Link
                to="/support"
                className="single-document-page__back"
            >
                <Icon icon={ArrowLeft} size={16} />
                Back to Support
            </Link>

            {loading && (
                <p>Loading document...</p>
            )}

            {error && (
                <p role="alert">
                    Could not load document: {error}
                </p>
            )}

            {!loading && !error && !document && (
                <p>Document not found.</p>
            )}

            {!loading && !error && document && (
                <article className="single-document-page__article">
                    <header className="single-document-page__header">
                        <span className="single-document-page__category">
                            <Icon icon={FileText} size={16} />
                            {document.category}
                        </span>

                        <h1>{document.title}</h1>
                        <p>{document.description}</p>
                    </header>

                    <div className="single-document-page__content">
                        <ReactMarkdown>
                            {document.content}
                        </ReactMarkdown>
                    </div>
                </article>
            )}
        </main>
    );
};
