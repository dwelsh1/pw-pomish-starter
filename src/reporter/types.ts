export enum AnnotationType {
    Precondition = 'Pre Condition',
    PostCondition = 'Post Condition',
    Description = 'Description',
    GoTo = 'Go To',
    Step = 'Step',
    Assert = 'Assert',
    Mock = 'Mock',
}

export enum TestStatusIcon {
    passed = 'check_circle',
    failed = 'cancel',
    skipped = 'skip_next',
    flaky = 'warning',
    timedOut = 'hourglass_empty'
}

export interface TestResults {
    num: number;
    title: string;
    timeDuration: number;
    duration: string;
    fileName: string;
    description?: string;
    status: string;
    tags: string[];
    steps: string[];
    preConditions: string[];
    postConditions: string[];
    browser: string;
    statusIcon: string;
    videoPath?: string;
    screenshotPaths?: string[];
    attachments?: { path: string; name: string }[];
    errors?: string[];
}

export interface TestSummary {
    duration: string;
    status: string;
    statusIcon: string;
    total: number;
    totalPassed: number;
    totalFailed: number;
    totalFlaky: number;
    totalSkipped: number;
    groupedResults: Record<string, TestResults[]>;
}
