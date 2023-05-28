import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default function queryString(params: any):string {
    return Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
}

export function randWord(wordLength: number): string {
    let alphabet = 'abcdefghjjklmnopqrstuvwzyz'
    let word = '';
    for (let i = 0; i < wordLength; i++) {
        let index = Math.random() * alphabet.length;
        word += alphabet.substring(index, index + 1);
    }
    return word;
}

export function downloadWithAxios(axios: NuxtAxiosInstance, url: string, filename: string) {
    url = axios.defaults.baseURL + url;
    axios({
        url,
        method: 'GET',
        responseType: 'blob', // important
    }).then((response: any) => {
        downloadData(response.data,filename)
    });
}

export function downloadData(data:any,filename:string){
    const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
}

export function getDeclaredClassesNames(classCode: string, classWitName: string = ''): string[] {
    let classes = classCode
        .split('class')
        .filter(it => it)
        .map(clazz => clazz.substring(0, clazz.indexOf("{")).trim())
        .filter(name => !!name.length);
    if (classWitName.length) {
        classes = classes.filter(it => it.toLowerCase().indexOf(classWitName.toLowerCase()) > -1)
    }
    return classes;
}

export function secondsToHms(d: any) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
    return hDisplay + mDisplay + sDisplay; 
}