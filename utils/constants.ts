export const WINDESHEIM_URL = "https://elo.windesheim.nl/";
export const WINDESHEIM_STUDY_ROUTES = `${WINDESHEIM_URL}services/Studyroutemobile.asmx/LoadStudyroutes?start=0&length=100000&filter=0&search=&_dc=1656164170052`;

export const WINDESHEIM_LOAD_USER_HANDIN_DETAILS = (
  studyRouteResourceId: string
) => {
  return `${WINDESHEIM_URL}services/Studyroutemobile.asmx/LoadUserHandinDetails?studyRouteResourceId=${studyRouteResourceId}&_dc=1656167205723`;
};

export const WINDESHEIM_LOAD_STUDY_ROUTE_CONTENT = (
  route_id: string | number,
  folder_id: string | number
) => {
  return `${WINDESHEIM_URL}services/Studyroutemobile.asmx/LoadStudyrouteContent?studyrouteid=${route_id}&parentid=${folder_id}&start=0&length=100000&_dc=1656165092641`;
};
