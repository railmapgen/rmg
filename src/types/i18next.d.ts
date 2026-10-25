// i18next 类型扩展：为项目翻译键提供 TypeScript 提示。
import 'i18next';

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false;
    }
}
