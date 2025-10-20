import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

export class HtmlHelper {
    async replaceTags(templateFile: string, objectToReplace: any, folderTest: string, fileName: string) {
        const templatePath = path.join(__dirname, 'templates', templateFile);
        const template = fs.readFileSync(templatePath, 'utf8');
        const htmlContent = ejs.render(template, objectToReplace);
        if (!fs.existsSync(folderTest)) {
            fs.mkdirSync(folderTest, { recursive: true });
        }
        fs.writeFileSync(fileName, htmlContent);
    }

    ansiToHtml(text: string): string {
        // Simple ANSI to HTML conversion
        return text
            .replace(/\x1b\[31m/g, '<span style="color: red;">')
            .replace(/\x1b\[32m/g, '<span style="color: green;">')
            .replace(/\x1b\[33m/g, '<span style="color: yellow;">')
            .replace(/\x1b\[0m/g, '</span>')
            .replace(/\n/g, '<br>');
    }
}

export class FileHelper {
    private folderResults = 'steps-report';

    copyFileToResults(folderTest: string, sourcePath: string): string {
        if (!sourcePath || !fs.existsSync(sourcePath)) {
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

    copyVideo(result: any, folderTest: string): string {
        const videoAttachment = result.attachments?.find((att: any) => att.name === 'video');
        if (videoAttachment?.path) {
            return this.copyFileToResults(folderTest, videoAttachment.path);
        }
        return '';
    }

    copyScreenshots(result: any, folderTest: string): string[] {
        const screenshotAttachments = result.attachments?.filter((att: any) => att.name === 'screenshot') || [];
        return screenshotAttachments.map((att: any) => this.copyFileToResults(folderTest, att.path)).filter(Boolean);
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
