import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default function queryString(params: any) {
    return Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
}

export function downloadWithAxios(axios: NuxtAxiosInstance, url: string, filename: string) {
    url = axios.defaults.baseURL + url;
    axios({
        url,
        method: 'GET',
        responseType: 'blob', // important
    }).then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    });
}