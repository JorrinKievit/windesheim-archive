import axios from "axios";
import {
  ApiError,
  StudyRouteContent,
  StudyRouteUserhandInDetails,
  ProgressEvent,
  FileProgressEvent,
} from "../types";
import { WINDESHEIM_URL } from "./constants";

export class ArchiveHandler {
  progress: number;
  directoryHandler!: FileSystemDirectoryHandle;

  constructor() {
    this.progress = 0;
  }

  getStudyRoutes = async () => {
    return await axios.get("/api/studyRoutes");
  };

  downloadFile = async (_url: string, folder: string, _filename: string) => {
    let url = _url;
    const filename = _filename ? _filename.replace("/", "_") : _filename;

    this.updateFileProgress(`${folder}/${filename}`);

    try {
      let currentDir = this.directoryHandler;

      for (let f of folder.split("/")) {
        currentDir = await currentDir.getDirectoryHandle(f, { create: true });
      }

      try {
        let f = await currentDir.getFileHandle(filename, { create: false });
        if (f) {
          console.log(`${filename} already exists`);
          return;
        }
      } catch (e) {
        console.log(`${filename} not found locally, retrieving`);
      }

      if (url.slice(0, 4) != "http") {
        url = WINDESHEIM_URL.slice(0, -1) + url;
      }

      const file = await axios.get(`/api/file/${encodeURIComponent(url)}`, {
        responseType: "arraybuffer",
      });

      let createdFile = await currentDir.getFileHandle(filename, {
        create: true,
      });
      let writable = await createdFile.createWritable();
      await writable.write(file.data);
      await writable.close();
    } catch (e: any) {
      console.error(
        `error during downloadfile: url: ${_url}, folder: ${folder}, file: ${filename}, error: ${e}`
      );
    }
  };

  downloadInleverBox = async (
    routeContent: StudyRouteContent,
    path: string
  ) => {
    try {
      const box = await axios.get(
        `/api/handInDetails/${routeContent.STUDYROUTE_RESOURCE_ID}`
      );

      const studyRouteHandInDetails: StudyRouteUserhandInDetails[] = box.data;

      studyRouteHandInDetails.forEach(async (handIn) => {
        if (handIn.DESCRIPTION_DOCUMENT_URL) {
          await this.downloadFile(
            handIn.DESCRIPTION_DOCUMENT_URL,
            `${path}/${routeContent.NAME}`,
            "description.htm"
          );
        }
        if (handIn.ASSIGNMENT_DOCUMENT_TYPE != -1) {
          await this.downloadFile(
            handIn.ASSIGNMENT_DOCUMENT_URL,
            `${path}/${routeContent.NAME}`,
            handIn.ASSIGNMENT_DOCUMENT_NAME
          );
        }
        if (handIn.HANDIN_CPVID != -1) {
          await this.downloadFile(
            handIn.HANDIN_URL,
            `${path}/${routeContent.NAME}`,
            handIn.HANDIN_NAME
          );
        }
      });
    } catch (e) {
      console.error(
        "DOWNLOAD_INLEVERBOX",
        `routeContent=${routeContent.NAME}, path=${path}`,
        e
      );
    }
  };

  parseFolder = async (route_id: number, folder_id: number, path: string) => {
    try {
      const response = await axios.get(
        `/api/studyRouteContent/${route_id}/${folder_id}`
      );
      const studyRoutesContent: StudyRouteContent[] = response.data;

      for (const routeContent of studyRoutesContent) {
        routeContent.NAME = this.cleanFolderName(routeContent.NAME);
        if (routeContent.ITEMTYPE == 0) {
          await this.parseFolder(
            route_id,
            routeContent.ID,
            path + "/" + routeContent.NAME
          );
          continue;
        } else if (routeContent.ITEMTYPE == 9) {
          await this.downloadInleverBox(routeContent, path);
          continue;
        } else if (routeContent.ITEMTYPE == 3) {
          console.log("TXT-PATH", path);
          let currentDir = this.directoryHandler;
          for (let f of path.split("/")) {
            currentDir = await currentDir.getDirectoryHandle(f, {
              create: true,
            });
          }

          let createdFile = await currentDir.getFileHandle(
            `${routeContent.NAME}.txt`,
            {
              create: true,
            }
          );
          let writable = await createdFile.createWritable();
          await writable.write(`This is a link to: \n ${routeContent.URL}`);
          await writable.close();
          continue;
        }
        await this.downloadFile(routeContent.URL, path, routeContent.NAME);
      }
    } catch (e) {
      console.error(
        "PARSE_FOLDER",
        `route_id=${route_id}, folder_id=${folder_id}, path=${path}`,
        e
      );
    }
  };

  cleanFolderName = (str: string) => {
    return str.replace(/[~:*?"<>| ]/g, "");
  };

  loopTroughResults = async (studyRoutes: StudyRouteContent[]) => {
    const progressionSteps = 100 / studyRoutes.length;
    for (const route of studyRoutes) {
      try {
        await this.parseFolder(route.ID, -1, route.NAME);
        this.progress += progressionSteps;
        this.updateProgress();
      } catch (e) {
        console.error("LOOP_TROUGH_RESULTS", e);
      }
    }
  };

  getArchive = async () => {
    const response = await this.getStudyRoutes();

    if (response.status === 200) {
      const studyRoutes = response.data;
      await this.loopTroughResults(
        studyRoutes as unknown as StudyRouteContent[]
      );
    } else {
      console.error((response.data as ApiError).message);
    }
    console.log("done!");
    this.updateFileProgress("");
  };

  updateProgress = () => {
    document.dispatchEvent(
      new CustomEvent<ProgressEvent>("updateProgress", {
        detail: { progress: this.progress },
      })
    );
  };

  updateFileProgress = (file: string) => {
    document.dispatchEvent(
      new CustomEvent<FileProgressEvent>("updateFileProgress", {
        detail: { file },
      })
    );
  };

  set FileSystemDirectoryHandle(dir: FileSystemDirectoryHandle) {
    this.directoryHandler = dir;
  }
}
