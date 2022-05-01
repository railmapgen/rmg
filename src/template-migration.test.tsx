import { writeFile, mkdir } from 'fs/promises';
import { companies } from './constants/company-config';
import { templateList } from './constants/templates/data';

describe('TemplateMigration', () => {
    beforeAll(async () => {
        await mkdir('./templates', { recursive: true });
    });

    it('Write company config as JSON', async () => {
        await writeFile('./templates/company-config.json', JSON.stringify(companies, null, 4));
    });

    it('Write templates as JSON', async () => {
        for (let [companyId, templates] of Object.entries(templateList)) {
            await mkdir(`./templates/${companyId}`, { recursive: true });
            await writeFile(`./templates/${companyId}/_config.json`, JSON.stringify(templates, null, 4));

            for (let template of templates) {
                const module = await import(`./constants/templates/${companyId}/${template.filename}`);
                await writeFile(
                    `./templates/${companyId}/${template.filename}.json`,
                    JSON.stringify(module.default, null, 4)
                );
            }

            console.log('Written templates of companyId=' + companyId);
        }
    });
});
