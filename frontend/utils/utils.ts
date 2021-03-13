export default function queryString(params: any) {
    return Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
}