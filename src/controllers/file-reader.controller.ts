// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {
  get,
  HttpErrors,
  oas,
  param,
  Response,
  RestBindings,
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class FileReaderController {
  constructor() {}
  @get('/files-reader', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles(@param.query.string('folderDir') folderDir: string) {
    const files = await readdir(folderDir);
    return files;
  }

  @get('/files-reader/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @param.query.string('folderDir') folderDir: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName, folderDir);
    response.download(file, fileName);
    return response;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(fileName: string, folderDir: string) {
    const resolved = path.resolve(folderDir, fileName);
    if (folderDir.charAt(0) !== '.') return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(
      `Invalid file name: ${fileName}. in ${folderDir}.`,
    );
  }
}
