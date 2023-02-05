import { CompanyEntry, TemplateEntry } from '@railmapgen/rmg-templates-resources';

export const fetchOtherCompanyConfig = async (): Promise<CompanyEntry[]> => {
    try {
        const response = await fetch('/rmg-templates/resources/other-company-config.json');
        return (await response.json()) as CompanyEntry[];
    } catch (e) {
        console.error('Failed to fetch non-core company config', e);
        return [];
    }
};

export const fetchTemplatesByCompany = async (company: string): Promise<TemplateEntry[]> => {
    try {
        const response = await fetch('/rmg-templates/resources/templates/' + company + '/00config.json');
        return (await response.json()) as TemplateEntry[];
    } catch (e) {
        console.error('Failed to fetch template list for ' + company, e);
        return [];
    }
};

export const fetchTemplate = async (company: string, filename: string) => {
    const response = await fetch(`/rmg-templates/resources/templates/${company}/${filename}.json`);
    return await response.json();
};
