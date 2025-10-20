import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

export class HtmlHelper {
    async replaceTags(templateFile: string, objectToReplace: unknown, folderTest: string, fileName: string) {
        const templatePath = path.join(__dirname, 'templates', templateFile);
        const template = fs.readFileSync(templatePath, 'utf8');
        const htmlContent = ejs.render(template, objectToReplace);
        if (!fs.existsSync(folderTest)) {
            fs.mkdirSync(folderTest, { recursive: true });
        }
        fs.writeFileSync(fileName, htmlContent);
    }

    ansiToHtml(text: string): string {
        // Simple ANSI to HTML conversion - using Unicode escape sequences
        // eslint-disable-next-line no-control-regex
        return text
            .replace(/\u001b\[31m/g, '<span style="color: red;">')
            .replace(/\u001b\[32m/g, '<span style="color: green;">')
            .replace(/\u001b\[33m/g, '<span style="color: yellow;">')
            .replace(/\u001b\[0m/g, '</span>')
            .replace(/\n/g, '<br>');
    }
}

export class FileHelper {
    private folderResults = 'steps-report';

    copyFileToResults(folderTest: string, sourcePath: string): string {
        if (!sourcePath || sourcePath.trim() === '' || !fs.existsSync(sourcePath)) {
            return '';
        }
        
        const fileName = path.basename(sourcePath);
        const destPath = path.join(folderTest, fileName);
        
        try {
            fs.copyFileSync(sourcePath, destPath);
            return fileName;
        } catch (error) {
            console.warn(`Failed to copy file ${sourcePath}:`, error);
            return '';
        }
    }

    copyVideo(result: unknown, folderTest: string): string {
        const videoAttachment = (result as { attachments?: unknown[] }).attachments?.find((att: unknown) => (att as { name?: string }).name === 'video');
        if (videoAttachment?.path) {
            return this.copyFileToResults(folderTest, videoAttachment.path);
        }
        return '';
    }

    copyScreenshots(result: unknown, folderTest: string): string[] {
        const screenshotAttachments = (result as { attachments?: unknown[] }).attachments?.filter((att: unknown) => (att as { name?: string }).name === 'screenshot') || [];
        return screenshotAttachments.map((att: unknown) => this.copyFileToResults(folderTest, (att as { path?: string }).path || '')).filter(Boolean);
    }
}

export class TimeHelper {
    formatDuration(duration: number): string {
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const milliseconds = duration % 1000;

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s ${milliseconds}ms`;
        } else if (remainingSeconds > 0) {
            return `${remainingSeconds}s ${milliseconds}ms`;
        } else {
            return `${milliseconds}ms`;
        }
    }
}
