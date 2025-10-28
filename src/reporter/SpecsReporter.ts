import { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as path from 'path';
import * as fs from 'fs';
import { TestResults, TestSummary, AnnotationType, TestStatusIcon } from './types';
import { HtmlHelper, FileHelper, TimeHelper } from './helpers';
import { PromptGenerator } from './PromptGenerator';
import { processTags } from './tag-utils';

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
    
    // File-based state sharing
    private stateFile = path.join('specs-report', 'shared-state.json');

    onBegin(config: FullConfig) {
        // Get the testDir from playwright.config.ts or default to tests
        this.testDir = config?.rootDir || 'tests';
        
        // Collect environment information
        this.summary.environment = this.collectEnvironmentInfo(config);
        
        // Load existing shared state
        this.loadSharedState();
    }
    
    private collectEnvironmentInfo(config: FullConfig): any {
        const os = process.platform;
        const nodeVersion = process.version;
        const playwrightVersion = require('@playwright/test/package.json').version;
        
        // Get browser information from project names
        const browsers: string[] = [];
        if (config.projects) {
            config.projects.forEach(project => {
                // Extract browser from project name (e.g., 'rbp-chromium' -> 'chromium')
                const projectName = project.name || '';
                if (projectName) {
                    // Format browser names for display
                    const browserName = this.formatBrowserName(projectName);
                    if (browserName && !browsers.includes(browserName)) {
                        browsers.push(browserName);
                    }
                }
            });
        }
        
        // Remove duplicates
        const uniqueBrowsers = [...new Set(browsers)];
        
        return {
            os: this.formatOSName(os),
            nodeVersion: nodeVersion,
            playwrightVersion: playwrightVersion,
            browsers: uniqueBrowsers,
            timestamp: new Date().toISOString(),
            runner: 'Playwright Test'
        };
    }
    
    private formatBrowserName(projectName: string): string {
        // Map common project name patterns to readable browser names
        if (projectName.includes('webkit') || projectName.includes('safari')) {
            return 'Safari/WebKit';
        } else if (projectName.includes('chromium') || projectName.includes('chrome')) {
            // Check if it's mobile
            if (projectName.includes('mobile')) {
                return 'Chrome (Mobile)';
            }
            return 'Chrome';
        } else if (projectName.includes('firefox')) {
            return 'Firefox';
        } else if (projectName.includes('edge')) {
            return 'Edge';
        }
        return '';
    }
    
    private formatOSName(platform: string): string {
        const osMap: Record<string, string> = {
            'win32': 'Windows',
            'linux': 'Linux',
            'darwin': 'macOS',
            'aix': 'AIX',
            'freebsd': 'FreeBSD',
            'openbsd': 'OpenBSD',
            'sunos': 'SunOS'
        };
        
        return osMap[platform] || platform;
    }
    
    private loadSharedState() {
        try {
            // Preserve the newly collected environment info
            const newlyCollectedEnv = this.summary.environment;
            
            if (fs.existsSync(this.stateFile)) {
                const stateData = fs.readFileSync(this.stateFile, 'utf8');
                const state = JSON.parse(stateData);
                
                // Load state but preserve or update environment info
                this.summary = state.summary || this.summary;
                
                // If we have a newly collected environment, or the existing one is empty, use the new one
                if (newlyCollectedEnv && (!this.summary.environment || !this.summary.environment.browsers || this.summary.environment.browsers.length === 0)) {
                    this.summary.environment = newlyCollectedEnv;
                }
                
                this.pendingAttachments = state.pendingAttachments || [];
                this.testNo = state.testNo || 0;
            }
        } catch (error) {
            console.warn('Failed to load shared state:', error);
        }
    }
    
    private saveSharedState() {
        try {
            // Ensure the directory exists
            const stateDir = path.dirname(this.stateFile);
            if (!fs.existsSync(stateDir)) {
                fs.mkdirSync(stateDir, { recursive: true });
            }
            
            // Create a clean copy without circular references
            const cleanPendingAttachments = this.pendingAttachments.map(pending => ({
                testNum: pending.testNum,
                folderTest: pending.folderTest,
                attachments: pending.attachments.map(att => ({
                    path: att.path,
                    name: att.name
                }))
                // Remove the result object as it contains circular references
            }));
            
            const state = {
                summary: this.summary,
                pendingAttachments: cleanPendingAttachments,
                testNo: this.testNo
            };
            fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
        } catch (error) {
            console.warn('Failed to save shared state:', error);
        }
    }

    async onTestEnd(test: TestCase, result: TestResult) {
        this.testNo++;
        const folderTest = path.join("specs-report", this.testNo.toString());
        // Normalize path to use forward slashes for consistency across platforms
        const groupKey = path.relative(this.testDir, test.location.file).replace(/\\/g, '/');

        // Ensure an array exists for this group
        if (!this.summary.groupedResults[groupKey]) {
            this.summary.groupedResults[groupKey] = [];
        }

        // Process tags: normalize, validate, and enrich with metadata
        const tagInfo = processTags(test.tags);
        const tags = tagInfo.map(ti => ti.normalized);
        
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
        
        // Store ALL attachments (including video and screenshots) for later copying
        const allAttachments = result.attachments?.map(attachment => ({ 
            path: attachment.path ?? '', 
            name: attachment.name ?? '' 
        })) ?? [];
        
        // Store attachment info for later copying (after all tests complete)
        this.pendingAttachments.push({
            testNum: this.testNo,
            folderTest: folderTest,
            attachments: allAttachments, // Store ALL attachments including video and screenshots
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
            tagInfo: tagInfo.map(ti => ({
                original: ti.original,
                normalized: ti.normalized,
                category: ti.category,
                color: ti.color,
                icon: ti.icon
            })),
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
        
        // Save shared state after each test
        this.saveSharedState();
        
        const fileName = 'index.html';
        const testFilePath = path.join(folderTest, fileName);
        await this.htmlHelper.replaceTags('stepReporter.html', { result: resultItem }, folderTest, testFilePath);
    }

    async onEnd(result: FullResult) {
        // Copy all pending attachments now that all tests are complete
        for (const pending of this.pendingAttachments) {
            try {
                const copiedFiles: string[] = [];
                
                // Copy all attachments (including video, screenshots, and other attachments)
                for (const attachment of pending.attachments) {
                    if (attachment.path) {
                        const copiedFile = this.fileHelper.copyFileToResults(pending.folderTest, attachment.path);
                        if (copiedFile) {
                            copiedFiles.push(copiedFile);
                        }
                    }
                }
                
                // Update the HTML file to use correct filenames if any files were copied
                if (copiedFiles.length > 0) {
                    await this.updateTestHtmlWithCorrectFilenames(pending.folderTest, pending.attachments || []);
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
        
        // Update screenshot references - use actual copied filename
        const screenshotAttachments = attachments.filter((att: any) => att.name === 'screenshot');
        for (const screenshotAttachment of screenshotAttachments) {
            if (screenshotAttachment.path) {
                const actualFileName = path.basename(screenshotAttachment.path);
                const escapedFileName = actualFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Replace src="screenshot" with actual filename
                htmlContent = htmlContent.replace(/src="screenshot"/g, `src="${actualFileName}"`);
            }
        }
        
        // Update video references - use actual copied filename
        const videoAttachment = attachments.find((att: any) => att.name === 'video');
        if (videoAttachment?.path) {
            const actualFileName = path.basename(videoAttachment.path);
            const escapedFileName = actualFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Replace src="video" with actual filename
            htmlContent = htmlContent.replace(/src="video"/g, `src="${actualFileName}"`);
            htmlContent = htmlContent.replace(/href="video"/g, `href="${actualFileName}"`);
        }
        
        // Update attachment links and add download attribute (remove target="_blank" to allow download)
        for (const attachment of attachments) {
            if (attachment.path && attachment.name !== 'video' && attachment.name !== 'screenshot') {
                const actualFileName = path.basename(attachment.path);
                const nameWithoutExt = path.parse(attachment.name).name; // "error-context" from "error-context.md"
                
                // Replace href="attachment-name" with href="actual-filename", add download, and remove target="_blank"
                const escapedNameWithoutExt = nameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                htmlContent = htmlContent.replace(
                    new RegExp(`<a\\s+href="${escapedNameWithoutExt}"([^>]*?)>`, 'g'), 
                    `<a href="${actualFileName}" download="${actualFileName}">`
                );
                // Also remove target="_blank" that might be added by the template
                htmlContent = htmlContent.replace(
                    new RegExp(`(<a\\s+[^>]*?)target="_blank"([^>]*?)>`, 'g'), 
                    `$1$2>`
                );
            }
        }
        
        fs.writeFileSync(htmlPath, htmlContent);
    }
}

export default SpecsReporter;
