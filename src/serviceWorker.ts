// 可选 Service Worker 注册辅助：处理生产环境缓存、更新与离线访问。
// 此文件用于按需注册 Service Worker，默认不会调用 register()。

// 生产环境启用后，再次访问时加载会更快，并获得离线能力。但这也意味着
// 已部署更新要等到页面现有标签页全部关闭后才会生效，因为缓存资源
// 在后台更新。

// 模式说明与启用方式见 https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] 是 IPv6 的本机回环地址。
    window.location.hostname === '[::1]' ||
    // IPv4 中将 127.0.0.0/8 视为本机地址。
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
        // 所有支持 Service Worker 的浏览器都提供 URL 构造函数。
        const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            // 若资源基础 URL 与页面来源不一致，Service Worker 将无法工作。
            // 使用 CDN 托管资源时可能出现此情况；
            // 参见 https://github.com/facebook/create-react-app/issues/2374
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${import.meta.env.BASE_URL}/service-worker.js`;

            if (isLocalhost) {
                // 当前运行在本机环境，检查是否已经存在可用的 Service Worker。
                checkValidServiceWorker(swUrl, config);

                // 在本机环境额外输出日志，提示开发者查看
                // Service Worker 与 PWA 文档。
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                            'worker. To learn more, visit https://bit.ly/CRA-PWA'
                    );
                });
            } else {
                // 非本机环境，直接注册 Service Worker。
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl: string, config?: Config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // 更新后的预缓存内容已获取，但旧 Service Worker
                            // 仍会继续提供旧内容，直到所有页面标签页关闭。
                            console.log(
                                'New content is available and will be used when all ' +
                                    'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
                            );

                            // 执行更新回调。
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            // 所有资源已完成预缓存，可以显示
                            // “内容已缓存，可离线使用”的提示。
                            console.log('Content is cached for offline use.');

                            // 执行成功回调。
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
    // 检查 Service Worker 文件是否存在；不存在时重新加载页面。
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then(response => {
            // 确认 Service Worker 存在，且响应确实是 JavaScript 文件。
            const contentType = response.headers.get('content-type');
            if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
                // 未找到 Service Worker，可能是其他应用占用了该路径；重新加载页面。
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                // 已找到 Service Worker，按正常流程注册。
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log('No internet connection found. App is running in offline mode.');
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}
