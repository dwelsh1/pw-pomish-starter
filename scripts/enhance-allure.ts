import { AllureEnhancer } from '../src/reporter/AllureEnhancer';
import * as path from 'path';

console.log('🚀 Enhancing Allure report with Copy Prompt functionality...');

const reportPath = path.join(__dirname, '..', 'allure-report', 'index.html');
const enhancer = new AllureEnhancer();
enhancer.enhanceReport(reportPath);

console.log('✨ Allure report enhancement complete!');
