import { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as path from 'path';
import * as fs from 'fs';
import { TestResults, TestSummary, AnnotationType, TestStatusIcon } from './types';
import { HtmlHelper, FileHelper, TimeHelper } from './helpers';
import { PromptGenerator } from './PromptGenerator';

class SpecsReporter implements Reporter {
    private testDir = 'tests';
    private testNo = 0;
    private summary: TestSummary = {
        duration: '',
        status: '',
        statusIcon: '',
        total: 0,
        totalPassed: 0,
        totalFailed: 0,
        totalFlaky: 0,
        totalSkipped: 0,
        groupedResults: {}
    };
    private pendingAttachments: Array<{testNum: number, folderTest: string, attachments: any[], result: any}> = [];
    private htmlHelper = new HtmlHelper();
    private fileHelper = new FileHelper();
    private timeHelper = new TimeHelper();
    private promptGenerator = new PromptGenerator();

    onBegin(config: FullConfig) {
        // Get the testDir from playwright.config.ts or default to tests
        this.testDir = config?.rootDir || 'tests';
    }

    async onTestEnd(test: TestCase, result: TestResult) {
        this.testNo++;
        const folderTest = path.join("specs-report", this.testNo.toString());
        const groupKey = path.relative(this.testDir, test.location.file);

        // Ensure an array exists for this group
        if (!this.summary.groupedResults[groupKey]) {
            this.summary.groupedResults[groupKey] = [];
        }

        // Remove the @ from test tags
        const tags = test.tags.map(tag => tag.replace('@', '')) ?? [];
        
        // Get the icon for each status
        const statusIcon = TestStatusIcon[result.status as keyof typeof TestStatusIcon];
        
        // Get the test steps (discard precondition, postcondition, description and a11y errors)
        const steps = test.annotations?.filter(annotation =>
            annotation.type !== AnnotationType.Precondition &&
            annotation.type !== AnnotationType.PostCondition &&
            annotation.type !== AnnotationType.Description &&
            annotation.type !== 'A11y')
            .map(annotation => annotation.description ?? 'No steps') ?? [];
        
        // Get the preconditions
        const preConditions = test.annotations?.filter(annotation => annotation.type === AnnotationType.Precondition)
            .map(annotation => annotation.description ?? 'No pre conditions') ?? [];
        
        // Get the postconditions
        const postConditions = test.annotations?.filter(annotation => annotation.type === AnnotationType.PostCondition)
            .map(annotation => annotation.description ?? 'No post conditions') ?? [];
        
        // Get the description
        const descriptionAnnotation = test.annotations?.find(annotation => annotation.type === AnnotationType.Description);
        const description = descriptionAnnotation?.description ?? 'No Description';
        
        // Get the browser name
        const browser = test.parent.project()?.name ?? 'No browser';

        // Get the attachments (discard screenshot, video and allure attachments)
        const attachments: { path: string; name: string }[] = result.attachments
            ?.filter(attachment => 
                attachment.name !== 'screenshot' && 
                attachment.name !== 'video' && 
                !attachment.name.toLowerCase().includes('allure'))
            .map(attachment => ({ 
                path: attachment.path ?? '', 
                name: attachment.name ?? '' 
            })) ?? [];
        
        // Store attachment info for later copying (after all tests complete)
        this.pendingAttachments.push({
            testNum: this.testNo,
            folderTest: folderTest,
            attachments: attachments,
            result: result
        });

        // For now, just use the attachment names without copying files
        const reportAttachments = attachments.map(attachment => ({
            path: attachment.name, // Use name instead of copied path
            name: attachment.name
        }));

        // For video and screenshots, just use the names for now
        const videoAttachment = result.attachments?.find((att: any) => att.name === 'video');
        const videoPath = videoAttachment?.name || '';
        
        const screenshotAttachments = result.attachments?.filter((att: any) => att.name === 'screenshot') ?? [];
        const screenshotPaths = screenshotAttachments.map((att: any) => att.name || '');

        // Get the errors
        const errors = result.errors?.map(error => this.htmlHelper.ansiToHtml(error.message ?? 'No errors')) ?? [];

        const formattedDuration = this.timeHelper.formatDuration(result.duration);

        const resultItem: TestResults = {
            num: this.testNo,
            title: test.title,
            fileName: groupKey,
            timeDuration: result.duration,
            duration: formattedDuration,
            description: description,
            status: result.status,
            browser: browser,
            tags: tags,
            preConditions: preConditions,
            steps: steps,
            postConditions: postConditions,
            statusIcon: statusIcon,
            videoPath: videoPath,
            screenshotPaths: screenshotPaths,
            attachments: reportAttachments,
            errors: errors
        };

        // Generate AI prompts for failed tests
        if (result.status === 'failed') {
            const fullPrompt = this.promptGenerator.generatePrompt(resultItem);
            const quickPrompt = this.promptGenerator.generateQuickPrompt(resultItem);
            const debugPrompt = this.promptGenerator.generateDebugPrompt(resultItem);
            
            // Add prompts to the resultItem
            resultItem.prompts = {
                full: fullPrompt,
                quick: quickPrompt,
                debug: debugPrompt
            };
        }

        // Add to the summary by filename
        this.summary.groupedResults[groupKey].push(resultItem);
        
        const wasRetried = test.results && test.results.length > 1;
        const isFlaky = wasRetried && result.status === 'passed';
        if (isFlaky) {
            this.summary.totalFlaky++;
        }
        
        switch (result.status) {
            case 'passed':
                this.summary.totalPassed++;
                break;
            case 'failed':
                this.summary.totalFailed++;
                break;
            case 'skipped':
                this.summary.totalSkipped++;
                break;
        }

        this.summary.total++;
        
        const fileName = 'index.html';
        const testFilePath = path.join(folderTest, fileName);
        await this.htmlHelper.replaceTags('stepReporter.html', { result: resultItem }, folderTest, testFilePath);
    }

    async onEnd(result: FullResult) {
        // Copy all pending attachments now that all tests are complete
        for (const pending of this.pendingAttachments) {
            try {
                const copiedFiles: string[] = [];
                
                // Copy attachments
                for (const attachment of pending.attachments) {
                    if (attachment.path) {
                        const copiedFile = this.fileHelper.copyFileToResults(pending.folderTest, attachment.path);
                        if (copiedFile) {
                            copiedFiles.push(copiedFile);
                        }
                    }
                }
                
                // Copy video
                const videoAttachment = pending.result.attachments?.find((att: any) => att.name === 'video');
                if (videoAttachment?.path) {
                    const copiedFile = this.fileHelper.copyFileToResults(pending.folderTest, videoAttachment.path);
                    if (copiedFile) {
                        copiedFiles.push(copiedFile);
                    }
                }
                
                // Copy screenshots
                const screenshotAttachments = pending.result.attachments?.filter((att: any) => att.name === 'screenshot') ?? [];
                for (const screenshot of screenshotAttachments) {
                    if (screenshot.path) {
                        const copiedFile = this.fileHelper.copyFileToResults(pending.folderTest, screenshot.path);
                        if (copiedFile) {
                            copiedFiles.push(copiedFile);
                        }
                    }
                }
                
                // Update the HTML file to use correct filenames
                if (copiedFiles.length > 0) {
                    await this.updateTestHtmlWithCorrectFilenames(pending.folderTest, pending.result.attachments || []);
                }
            } catch (error) {
                console.warn(`Failed to copy attachments for test ${pending.testNum}:`, error);
            }
        }
        
        const folderTest = this.fileHelper.folderResults;
        const summaryName = 'index.html';
        const summaryPath = path.join(folderTest, summaryName);
        
        this.summary.duration = this.timeHelper.formatDuration(result.duration);
        this.summary.status = result.status;
        const statusIcon = TestStatusIcon[result.status as keyof typeof TestStatusIcon];
        this.summary.statusIcon = statusIcon;
        
        await this.htmlHelper.replaceTags('summary.html', { results: this.summary }, folderTest, summaryPath);
    }
    
    private async updateTestHtmlWithCorrectFilenames(folderTest: string, attachments: any[]) {
        const htmlPath = path.join(folderTest, 'index.html');
        if (!fs.existsSync(htmlPath)) return;
        
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Update screenshot references
        const screenshotAttachment = attachments.find((att: any) => att.name === 'screenshot');
        if (screenshotAttachment?.path) {
            const screenshotName = path.basename(screenshotAttachment.path);
            htmlContent = htmlContent.replace(/src="screenshot"/g, `src="${screenshotName}"`);
        }
        
        // Update video references
        const videoAttachment = attachments.find((att: any) => att.name === 'video');
        if (videoAttachment?.path) {
            const videoName = path.basename(videoAttachment.path);
            htmlContent = htmlContent.replace(/src="video"/g, `src="${videoName}"`);
            htmlContent = htmlContent.replace(/href="video"/g, `href="${videoName}"`);
        }
        
        // Update attachment links
        for (const attachment of attachments) {
            if (attachment.path && attachment.name !== 'video' && attachment.name !== 'screenshot') {
                const fileName = path.basename(attachment.path);
                htmlContent = htmlContent.replace(new RegExp(`href="${attachment.name}"`, 'g'), `href="${fileName}"`);
            }
        }
        
        fs.writeFileSync(htmlPath, htmlContent);
    }
}

export default SpecsReporter;
