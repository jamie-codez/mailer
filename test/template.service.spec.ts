import { TemplateService } from '../src/template.service';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as handlebars from 'handlebars';

// Mock the fs and path modules
jest.mock('node:fs');
jest.mock('node:path');

describe('TemplateService', () => {
  let service: TemplateService;
  const mockTemplateDir = '/mock/templates';
  const mockTemplateContent = '<h1>Hello {{name}}</h1>';

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock implementations
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    (fs.readFileSync as jest.Mock).mockReturnValue(mockTemplateContent);

    // Create the service with mock config
    service = new TemplateService({
      directory: mockTemplateDir,
      engine: 'handlebars',
      options: {},
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('renderTemplate', () => {
    it('should read template file and render it with context', () => {
      const templateName = 'welcome';
      const context = { name: 'John' };
      
      const result = service.renderTemplate(templateName, context);
      
      // Verify the file was read from a correct path
      expect(path.join).toHaveBeenCalledWith(mockTemplateDir, 'welcome.hbs');
      expect(fs.readFileSync).toHaveBeenCalledWith(`${mockTemplateDir}/welcome.hbs`, 'utf8');
      
      // Verify the template was rendered with context
      expect(result).toBe('<h1>Hello John</h1>');
    });

    it('should handle empty context', () => {
      const templateName = 'welcome';
      const context = {};
      
      const result = service.renderTemplate(templateName, context);
      
      expect(result).toBe('<h1>Hello </h1>');
    });
  });

  describe('renderStringTemplate', () => {
    it('should render string template with context', () => {
      const templateString = '<p>Hi {{name}}, welcome to {{company}}</p>';
      const context = { name: 'John', company: 'Acme Inc' };
      
      const result = service.renderStringTemplate(templateString, context);
      
      expect(result).toBe('<p>Hi John, welcome to Acme Inc</p>');
    });

    it('should handle empty context', () => {
      const templateString = '<p>Hi {{name}}, welcome to {{company}}</p>';
      const context = {};
      
      const result = service.renderStringTemplate(templateString, context);
      
      expect(result).toBe('<p>Hi , welcome to </p>');
    });
  });

  describe('ifCond helper', () => {
    it('should handle equality conditions', () => {
      const template = handlebars.compile('{{#ifCond value "==" 5}}Equal{{else}}Not Equal{{/ifCond}}');
      
      expect(template({ value: 5 })).toBe('Equal');
      expect(template({ value: 10 })).toBe('Not Equal');
    });

    it('should handle strict equality conditions', () => {
      const template = handlebars.compile('{{#ifCond value "===" 5}}Equal{{else}}Not Equal{{/ifCond}}');
      
      expect(template({ value: 5 })).toBe('Equal');
      expect(template({ value: "5" })).toBe('Not Equal');
    });

    it('should handle inequality conditions', () => {
      const template = handlebars.compile('{{#ifCond value "!=" 5}}Not Equal{{else}}Equal{{/ifCond}}');
      
      expect(template({ value: 10 })).toBe('Not Equal');
      expect(template({ value: 5 })).toBe('Equal');
    });

    it('should handle strict inequality conditions', () => {
      const template = handlebars.compile('{{#ifCond value "!==" 5}}Not Equal{{else}}Equal{{/ifCond}}');
      
      expect(template({ value: "5" })).toBe('Not Equal');
      expect(template({ value: 5 })).toBe('Equal');
    });

    it('should handle less than conditions', () => {
      const template = handlebars.compile('{{#ifCond value "<" 5}}Less{{else}}Not Less{{/ifCond}}');
      
      expect(template({ value: 3 })).toBe('Less');
      expect(template({ value: 5 })).toBe('Not Less');
      expect(template({ value: 7 })).toBe('Not Less');
    });

    it('should handle less than or equal conditions', () => {
      const template = handlebars.compile('{{#ifCond value "<=" 5}}Less or Equal{{else}}Greater{{/ifCond}}');
      
      expect(template({ value: 3 })).toBe('Less or Equal');
      expect(template({ value: 5 })).toBe('Less or Equal');
      expect(template({ value: 7 })).toBe('Greater');
    });

    it('should handle greater than conditions', () => {
      const template = handlebars.compile('{{#ifCond value ">" 5}}Greater{{else}}Not Greater{{/ifCond}}');
      
      expect(template({ value: 7 })).toBe('Greater');
      expect(template({ value: 5 })).toBe('Not Greater');
      expect(template({ value: 3 })).toBe('Not Greater');
    });

    it('should handle greater than or equal conditions', () => {
      const template = handlebars.compile('{{#ifCond value ">=" 5}}Greater or Equal{{else}}Less{{/ifCond}}');
      
      expect(template({ value: 7 })).toBe('Greater or Equal');
      expect(template({ value: 5 })).toBe('Greater or Equal');
      expect(template({ value: 3 })).toBe('Less');
    });

    it('should handle logical AND conditions', () => {
      const template = handlebars.compile('{{#ifCond value1 "&&" value2}}Both True{{else}}Not Both True{{/ifCond}}');
      
      expect(template({ value1: true, value2: true })).toBe('Both True');
      expect(template({ value1: true, value2: false })).toBe('Not Both True');
      expect(template({ value1: false, value2: true })).toBe('Not Both True');
      expect(template({ value1: false, value2: false })).toBe('Not Both True');
    });

    it('should handle logical OR conditions', () => {
      const template = handlebars.compile('{{#ifCond value1 "||" value2}}Either True{{else}}Both False{{/ifCond}}');
      
      expect(template({ value1: true, value2: true })).toBe('Either True');
      expect(template({ value1: true, value2: false })).toBe('Either True');
      expect(template({ value1: false, value2: true })).toBe('Either True');
      expect(template({ value1: false, value2: false })).toBe('Both False');
    });

    it('should handle invalid operators', () => {
      const template = handlebars.compile('{{#ifCond value1 "invalid" value2}}True{{else}}False{{/ifCond}}');
      
      expect(template({ value1: true, value2: true })).toBe('False');
    });
  });
});