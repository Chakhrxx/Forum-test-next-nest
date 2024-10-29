// src/swagger.config.ts
import { SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';

export const swagger = (app: INestApplication) => {
  // Load Swagger YAML file
  const document = jsYaml.load(fs.readFileSync('src/swagger.yaml', 'utf8'));
  SwaggerModule.setup('document', app, document);
};
