import { HtmlHelper, FileHelper, TimeHelper } from '../../src/reporter/helpers';
import * as fs from 'fs';
import * as path from 'path';

describe('HtmlHelper', () => {
  let htmlHelper: HtmlHelper;
  const testDir = 'test-temp';

  beforeEach(() => {
    htmlHelper = new HtmlHelper();
    
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('replaceTags', () => {
    it('should render template with data and create HTML file', async () => {
      const templateData = {
        result: {
          title: 'Test Title',
          status: 'passed',
          duration: '2.5s'
        }
      };

      const outputFile = path.join(testDir, 'test-output.html');
      
      // Mock template file
      const templateContent = '<h1><%= result.title %></h1><p>Status: <%= result.status %></p>';
      const templatePath = path.join(testDir, 'test-template.html');
      fs.writeFileSync(templatePath, templateContent);

      // Create a mock HtmlHelper that uses our template
      const mockHtmlHelper = new HtmlHelper();
      
      // We'll test the actual functionality by creating the template in the expected location
      const templatesDir = path.join(__dirname, '../../src/reporter/templates');
      if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
      }
      fs.writeFileSync(path.join(templatesDir, 'test-template.html'), templateContent);

      await mockHtmlHelper.replaceTags('test-template.html', templateData, testDir, outputFile);

      // Verify file was created
      expect(fs.existsSync(outputFile)).toBe(true);
      
      // Verify content
      const content = fs.readFileSync(outputFile, 'utf8');
      expect(content).toContain('<h1>Test Title</h1>');
      expect(content).toContain('<p>Status: passed</p>');

      // Clean up
      fs.unlinkSync(path.join(templatesDir, 'test-template.html'));
    });

    it('should create directory if it does not exist', async () => {
      const nonExistentDir = path.join(testDir, 'non-existent');
      const outputFile = path.join(nonExistentDir, 'test.html');
      
      const templateData = { result: { title: 'Test' } };
      const templateContent = '<h1><%= result.title %></h1>';
      const templatePath = path.join(testDir, 'template.html');
      fs.writeFileSync(templatePath, templateContent);

      // Create template in expected location
      const templatesDir = path.join(__dirname, '../../src/reporter/templates');
      if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
      }
      fs.writeFileSync(path.join(templatesDir, 'template.html'), templateContent);

      await htmlHelper.replaceTags('template.html', templateData, nonExistentDir, outputFile);

      expect(fs.existsSync(nonExistentDir)).toBe(true);
      expect(fs.existsSync(outputFile)).toBe(true);

      // Clean up
      fs.unlinkSync(path.join(templatesDir, 'template.html'));
    });
  });

  describe('ansiToHtml', () => {
    it('should convert ANSI color codes to HTML spans', () => {
      const ansiText = '\u001b[31mRed text\u001b[0m and \u001b[32mGreen text\u001b[0m';
      const result = htmlHelper.ansiToHtml(ansiText);
      
      expect(result).toBe('<span style="color: red;">Red text</span> and <span style="color: green;">Green text</span>');
    });

    it('should convert newlines to HTML breaks', () => {
      const textWithNewlines = 'Line 1\nLine 2\nLine 3';
      const result = htmlHelper.ansiToHtml(textWithNewlines);
      
      expect(result).toBe('Line 1<br>Line 2<br>Line 3');
    });

    it('should handle mixed ANSI codes and newlines', () => {
      const complexText = '\u001b[31mError:\u001b[0m\n\u001b[33mWarning:\u001b[0m\nNormal text';
      const result = htmlHelper.ansiToHtml(complexText);
      
      expect(result).toBe('<span style="color: red;">Error:</span><br><span style="color: yellow;">Warning:</span><br>Normal text');
    });

    it('should handle text without ANSI codes', () => {
      const plainText = 'This is plain text with\nnewlines';
      const result = htmlHelper.ansiToHtml(plainText);
      
      expect(result).toBe('This is plain text with<br>newlines');
    });

    it('should handle empty string', () => {
      const result = htmlHelper.ansiToHtml('');
      expect(result).toBe('');
    });

    it('should handle null or undefined input', () => {
      expect(() => htmlHelper.ansiToHtml(null as any)).not.toThrow();
      expect(() => htmlHelper.ansiToHtml(undefined as any)).not.toThrow();
    });
  });
});

describe('FileHelper', () => {
  let fileHelper: FileHelper;
  const testDir = 'test-temp';

  beforeEach(() => {
    fileHelper = new FileHelper();
    
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      try {
        fs.rmSync(testDir, { recursive: true, force: true });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('copyFileToResults', () => {
    it('should return empty string for non-existent source file', () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      const destDir = path.join(testDir, 'dest');
      
      const result = fileHelper.copyFileToResults(destDir, nonExistentFile);
      
      expect(result).toBe('');
    });

    it('should return empty string for empty source path', () => {
      const destDir = path.join(testDir, 'dest');
      
      expect(fileHelper.copyFileToResults(destDir, '')).toBe('');
      expect(fileHelper.copyFileToResults(destDir, '   ')).toBe('');
    });

  });

  describe('copyVideo', () => {
    it('should copy video attachment successfully', () => {
      const videoPath = path.join(testDir, 'video.webm');
      const destDir = path.join(testDir, 'dest');
      
      // Create video file and destination directory
      fs.writeFileSync(videoPath, 'video content');
      fs.mkdirSync(destDir, { recursive: true });
      
      const mockResult = {
        attachments: [
          { name: 'video', path: videoPath }
        ]
      };
      
      const result = fileHelper.copyVideo(mockResult, destDir);
      
      expect(result).toBe('video.webm');
      expect(fs.existsSync(path.join(destDir, 'video.webm'))).toBe(true);
    });

    it('should return empty string when no video attachment exists', () => {
      const destDir = path.join(testDir, 'dest');
      
      const mockResult = {
        attachments: [
          { name: 'screenshot', path: 'screenshot.png' }
        ]
      };
      
      const result = fileHelper.copyVideo(mockResult, destDir);
      
      expect(result).toBe('');
    });

    it('should return empty string when attachments array is empty', () => {
      const destDir = path.join(testDir, 'dest');
      
      const mockResult = { attachments: [] };
      
      const result = fileHelper.copyVideo(mockResult, destDir);
      
      expect(result).toBe('');
    });

    it('should return empty string when attachments is undefined', () => {
      const destDir = path.join(testDir, 'dest');
      
      const mockResult = {};
      
      const result = fileHelper.copyVideo(mockResult, destDir);
      
      expect(result).toBe('');
    });
  });

  describe('copyScreenshots', () => {
    it('should copy all screenshot attachments', () => {
      const screenshot1 = path.join(testDir, 'screenshot1.png');
      const screenshot2 = path.join(testDir, 'screenshot2.png');
      const destDir = path.join(testDir, 'dest');
      
      // Create screenshot files and destination directory
      fs.writeFileSync(screenshot1, 'screenshot1 content');
      fs.writeFileSync(screenshot2, 'screenshot2 content');
      fs.mkdirSync(destDir, { recursive: true });
      
      const mockResult = {
        attachments: [
          { name: 'screenshot', path: screenshot1 },
          { name: 'screenshot', path: screenshot2 },
          { name: 'video', path: 'video.webm' }
        ]
      };
      
      const result = fileHelper.copyScreenshots(mockResult, destDir);
      
      expect(result).toEqual(['screenshot1.png', 'screenshot2.png']);
      expect(fs.existsSync(path.join(destDir, 'screenshot1.png'))).toBe(true);
      expect(fs.existsSync(path.join(destDir, 'screenshot2.png'))).toBe(true);
    });

    it('should return empty array when no screenshot attachments exist', () => {
      const destDir = path.join(testDir, 'dest');
      
      const mockResult = {
        attachments: [
          { name: 'video', path: 'video.webm' }
        ]
      };
      
      const result = fileHelper.copyScreenshots(mockResult, destDir);
      
      expect(result).toEqual([]);
    });

    it('should filter out invalid screenshot paths', () => {
      const validScreenshot = path.join(testDir, 'valid.png');
      const destDir = path.join(testDir, 'dest');
      
      // Create valid screenshot file and destination directory
      fs.writeFileSync(validScreenshot, 'valid content');
      fs.mkdirSync(destDir, { recursive: true });
      
      const mockResult = {
        attachments: [
          { name: 'screenshot', path: validScreenshot },
          { name: 'screenshot', path: 'invalid.png' }, // Non-existent file
          { name: 'screenshot', path: '' } // Empty path
        ]
      };
      
      const result = fileHelper.copyScreenshots(mockResult, destDir);
      
      expect(result).toEqual(['valid.png']);
    });
  });
});

describe('TimeHelper', () => {
  let timeHelper: TimeHelper;

  beforeEach(() => {
    timeHelper = new TimeHelper();
  });

  describe('formatDuration', () => {
    it('should format milliseconds correctly', () => {
      expect(timeHelper.formatDuration(500)).toBe('500ms');
      expect(timeHelper.formatDuration(999)).toBe('999ms');
    });

    it('should format seconds correctly', () => {
      expect(timeHelper.formatDuration(1000)).toBe('1s 0ms');
      expect(timeHelper.formatDuration(1500)).toBe('1s 500ms');
      expect(timeHelper.formatDuration(5000)).toBe('5s 0ms');
    });

    it('should format minutes correctly', () => {
      expect(timeHelper.formatDuration(60000)).toBe('1m 0s 0ms');
      expect(timeHelper.formatDuration(65000)).toBe('1m 5s 0ms');
      expect(timeHelper.formatDuration(65500)).toBe('1m 5s 500ms');
    });

    it('should handle large durations', () => {
      expect(timeHelper.formatDuration(3661000)).toBe('61m 1s 0ms');
    });

    it('should handle zero duration', () => {
      expect(timeHelper.formatDuration(0)).toBe('0ms');
    });

    it('should handle negative duration', () => {
      expect(timeHelper.formatDuration(-1000)).toBe('-1s 0ms');
    });

    it('should handle decimal durations by flooring', () => {
      expect(timeHelper.formatDuration(1500.7)).toBe('1s 500ms');
      expect(timeHelper.formatDuration(60000.9)).toBe('1m 0s 0ms');
    });
  });
});
