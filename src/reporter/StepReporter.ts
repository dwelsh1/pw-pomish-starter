import { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as path from 'path';
import { TestResults, TestSummary, AnnotationType, TestStatusIcon } from './types';
import { HtmlHelper, FileHelper, TimeHelper } from './helpers';

class StepReporter implements Reporter {
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
    private htmlHelper = new HtmlHelper();
    private fileHelper = new FileHelper();
    private timeHelper = new TimeHelper();

    onBegin(config: FullConfig) {
        // Get the testDir from playwright.config.ts or default to tests
        this.testDir = config?.rootDir || 'tests';
    }

    async onTestEnd(test: TestCase, result: TestResult) {
        this.testNo++;
        const folderTest = path.join("steps-report", this.testNo.toString());
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
        const steps = test.annotations.filter(annotation =>
            annotation.type !== AnnotationType.Precondition &&
            annotation.type !== AnnotationType.PostCondition &&
            annotation.type !== AnnotationType.Description &&
            annotation.type !== 'A11y')
            .map(annotation => annotation.description ?? 'No steps');
        
        // Get the preconditions
        const preConditions = test.annotations.filter(annotation => annotation.type === AnnotationType.Precondition)
            .map(annotation => annotation.description ?? 'No pre conditions');
        
        // Get the postconditions
        const postConditions = test.annotations.filter(annotation => annotation.type === AnnotationType.PostCondition)
            .map(annotation => annotation.description ?? 'No post conditions');
        
        // Get the description
        const descriptionAnnotation = test.annotations.find(annotation => annotation.type === AnnotationType.Description);
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
        
        // Copy the attachments to the folder with the custom report
        const reportAttachments = attachments.map(attachment => ({
            path: this.fileHelper.copyFileToResults(folderTest, attachment.path),
            name: attachment.name
        }));

        // Copy the video
        const videoPath = this.fileHelper.copyVideo(result, folderTest);

        // Copy the screenshots
        const screenshotPaths = this.fileHelper.copyScreenshots(result, folderTest);

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
        const folderTest = this.fileHelper.folderResults;
        const summaryName = 'summary.html';
        const summaryPath = path.join(folderTest, summaryName);
        
        this.summary.duration = this.timeHelper.formatDuration(result.duration);
        this.summary.status = result.status;
        const statusIcon = TestStatusIcon[result.status as keyof typeof TestStatusIcon];
        this.summary.statusIcon = statusIcon;
        
        await this.htmlHelper.replaceTags('summary.html', { results: this.summary }, folderTest, summaryPath);
    }
}

export default StepReporter;
