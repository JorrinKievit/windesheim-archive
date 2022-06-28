import axios, { AxiosInstance } from "axios";
import {
  ApiError,
  StudyRouteContent,
  StudyRouteUserhandInDetails,
  ProgressEvent,
} from "../types";
import {
  WINDESHEIM_LOAD_STUDY_ROUTE_CONTENT,
  WINDESHEIM_LOAD_USER_HANDIN_DETAILS,
  WINDESHEIM_STUDY_ROUTES,
  WINDESHEIM_URL,
} from "./constants";
import Agent from "agentkeepalive";

export class ArchiveHandler {
  progress: number;
  directoryHandler!: FileSystemDirectoryHandle;
  client: AxiosInstance;

  constructor() {
    const axiosInstance = axios.create({
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      withCredentials: true,
      httpAgent: new Agent(),
      httpsAgent: new Agent.HttpsAgent(),
    });

    this.progress = 0;
    this.client = axiosInstance;
  }

  getStudyRoutes = async () => {
    return await this.client.get(WINDESHEIM_STUDY_ROUTES);
  };

  downloadFile = async (_url: string, folder: string, _filename: string) => {
    let url = _url;
    const filename = _filename ? _filename.replace("/", "_") : _filename;

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
        console.log(`${filename} does not exist, retrieving`);
      }

      if (url.slice(0, 4) != "http") {
        url = WINDESHEIM_URL.slice(0, -1) + url;
      }

      const file = await this.client.get(url);

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
      const box = await this.client.get(
        WINDESHEIM_LOAD_USER_HANDIN_DETAILS(routeContent.STUDYROUTE_RESOURCE_ID)
      );

      const studyRouteHandInDetails: StudyRouteUserhandInDetails[] =
        box.data.STUDYROUTE_USER_HANDINDETAILS;

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
      const response = await this.client.get(
        WINDESHEIM_LOAD_STUDY_ROUTE_CONTENT(route_id, folder_id)
      );
      const studyRoutesContent: StudyRouteContent[] =
        response.data.STUDYROUTE_CONTENT;

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
      const studyRoutes = response.data.STUDYROUTES;
      await this.loopTroughResults(
        studyRoutes as unknown as StudyRouteContent[]
      );
    } else {
      console.error((response.data as ApiError).message);
    }
    console.log("done");
  };

  updateProgress = () => {
    document.dispatchEvent(
      new CustomEvent<ProgressEvent>("updateProgress", {
        detail: { progress: this.progress },
      })
    );
  };

  set FileSystemDirectoryHandle(dir: FileSystemDirectoryHandle) {
    this.directoryHandler = dir;
  }
}
