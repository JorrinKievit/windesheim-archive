export interface Cookies {
  _3sct: string;
  "N%40TCookie": string;
}

export interface CookieJarCookies extends Cookies {
  IsActiveOrIsRunningInMSTeams: "True" | "False";
}

export interface StudyRouteContent {
  ID: number;
  NAME: string;
  DESCRIPTION: string;
  IMAGEURL_24: string;
  FEATURES: number;
  STATUS: number;
  IS_FAVORITE: boolean;
  CPVID: number;
  PREFACEPAGE_URL: string;
  ITEMTYPE: number;
  URL: string;
  STUDYROUTE_RESOURCE_ID: string;
}

export interface StudyRouteUserhandInDetails {
  ID: number;
  TITLE: string;
  STUDYROUTE_NAME: string;
  DESCRIPTION_DOCUMENT_URL: string;
  ASSIGNMENT_DOCUMENT_URL: string;
  ASSIGNMENT_DOCUMENT_NAME: string;
  ASSIGNMENT_DOCUMENT_TYPE: number;
  ASSIGNMENT_DOCUMENT_CPVID: number;
  INITIAL_DOCUMENT_STATUS: number;
  INITIAL_DOCUMENT_CPID: number;
  INITIAL_DOCUMENT_CPVID: number;
  IS_INITIAL: number;
  HANDIN_URL: string;
  HANDIN_NAME: string;
  HANDIN_CPVID: number;
  REVIEW_TYPE: number;
  REVIEW_PUBLISHED: number;
  REVIEW_CPVID: number;
  NATSCHOOL_STATUS: number;
}

export interface ApiError {
  message: string;
}

export interface ProgressEvent {
  progress: number;
}

export interface FileProgressEvent {
  file: string;
}
