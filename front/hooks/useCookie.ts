export const useCookie = (cookieString: string) => {
    const cookie = cookieString.split("; ");
    let result: {
      [key: string]: string;
    } = {};

    for (let i = 0; i < cookie.length; i++) {
      let cur = cookie[i].split("=");
      result[cur[0]] = cur[1];
    }
    return result;
};
