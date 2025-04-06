export function injectPathParams(url: string, pathParams: Record<string, string>): string {
    let updatedUrl = url;
    for (const key in pathParams) {
        updatedUrl = updatedUrl.replace(`:${key}`, encodeURIComponent(pathParams[key]));
    }
    return updatedUrl;
}