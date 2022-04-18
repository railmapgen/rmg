import React, { HTMLProps, ReactNode } from 'react';

interface ErrorBoundaryProps extends HTMLProps<HTMLDivElement> {
    children?: ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, any> {
    constructor(props: ErrorBoundaryProps) {
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
        const { children, ...others } = this.props;

        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div {...others}>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error?.toString()}
                        <br />
                        {this.state.errorInfo?.componentStack}
                    </details>

                    <p>
                        Please try to refresh or re-import your configuration files. If the issue still persists, please
                        consider upgrading your browser or submit an issue in{' '}
                        <a
                            href="https://github.com/railmapgen/rmg/issues"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'underline' }}
                        >
                            GitHub Issue
                        </a>{' '}
                        with the detail shown above.
                    </p>

                    <p>
                        請嘗試重新整理或重新上載設定檔。如果問題仍然存在，請考慮更新你的瀏覽器，或前往
                        <a
                            href="https://github.com/railmapgen/rmg/issues"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'underline' }}
                        >
                            GitHub Issue
                        </a>
                        提交一個Issue並附上詳情。
                    </p>

                    <p>
                        请尝试刷新或或重新上传配置文件。如果问题仍然存在，请考虑更新您的浏览器，或前往
                        <a
                            href="https://github.com/railmapgen/rmg/issues"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'underline' }}
                        >
                            GitHub Issue
                        </a>
                        提交一个Issue并附上详情。
                    </p>
                </div>
            );
        }

        return children;
    }
}
