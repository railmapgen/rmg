// 页面元数据工具：同步项目标题与文档标题。
import rmgRuntime from '@railmapgen/rmg-runtime';

export const updateTitle = (title: string) => {
    document.title = title;
    setTimeout(() => {
        rmgRuntime.updateAppMetadata({ title });
    }, 200);
};
