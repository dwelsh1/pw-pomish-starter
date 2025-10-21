#!/usr/bin/env node

import { OrtoniEnhancer } from './src/reporter/OrtoniEnhancer';
import * as path from 'path';

async function main() {
  const ortoniReportPath = path.join(process.cwd(), 'ortoni-report');
  
  console.log('🚀 Enhancing Ortoni report with Copy Prompt functionality...');
  
  const enhancer = new OrtoniEnhancer(ortoniReportPath);
  await enhancer.enhanceReport();
  
  console.log('✨ Ortoni report enhancement complete!');
}

main().catch(console.error);
