import React from 'react';

export default class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: any; errorInfo: any }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.errorInfo) {
            // You can render any custom fallback UI
            return <h1>Something went wrong. {this.state.error.toString()}</h1>;
        }

        return this.props.children;
    }
}
