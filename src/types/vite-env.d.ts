/// <reference types="vite/client" />
// Vite 环境类型声明：声明内置环境变量与模块类型。

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    // 可继续补充环境变量……
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
