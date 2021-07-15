import { v4 as uuidv4 } from "uuid";
export function loadUserUuid() {
    let userUuid = "";
    if (process.browser) {
        userUuid = localStorage?.getItem("userUuid") || "";
        if (!userUuid) {
            userUuid = uuidv4();
            localStorage?.setItem("userUuid", userUuid);
        }
    }
    return userUuid
}