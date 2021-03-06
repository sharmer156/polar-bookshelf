import {FileLoader} from './FileLoader';
import {WebResource} from '../../../electron/webresource/WebResource';
import {FileRegistry} from '../../../backend/webserver/FileRegistry';
import {AppPaths} from '../../../electron/webresource/AppPaths';
import {LoadedFile} from './LoadedFile';
import {Logger} from '../../../logger/Logger';
import {FilePaths} from '../../../util/FilePaths';

const log = Logger.create();

export class PDFLoader extends FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        super();
        this.fileRegistry = fileRegistry;
    }

    public async registerForLoad(path: string): Promise<LoadedFile> {

        const filename = FilePaths.basename(path);

        const fileMeta = this.fileRegistry.registerFile(path);

        const fileParam = encodeURIComponent(fileMeta.url);
        const filenameParam = encodeURIComponent(filename);

        const appURL = AppPaths.resource(`./pdfviewer/web/viewer.html?file=${fileParam}&filename=${filenameParam}`);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

}

