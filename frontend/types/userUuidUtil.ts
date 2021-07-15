import { v4 as uuidv4 } from "uuid";

export function loadUserUuid(forceCreateNew: boolean = false) {
    let userUuid = "";
    if (process.browser) {
        userUuid = localStorage?.getItem("userUuid") || "";
        if (!userUuid || forceCreateNew) {
            userUuid = uuidv4();
            localStorage?.setItem("userUuid", userUuid);
        }
    }
    return userUuid
}