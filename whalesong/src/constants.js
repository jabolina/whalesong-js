import path from "path";

export const SCRIPTLET_PATH = path.join(__dirname, "whatsapp-output", "whalesong.js");

export const WHATSAPP_WEB_URL = "https://web.whatsapp.com";
export const DEFAULT_DATA_DIR = path.join(__dirname, "chromium-data");
export const DEFAULT_CHROMIUM_ARGS = [
    `--app=${WHATSAPP_WEB_URL}`,
    "--single-process",
    "--disable-gpu",
    "--renderer",
    "--no-sandbox",
    "--no-service-autorun",
    "--no-experiments",
    "--no-default-browser-check",
    "--disable-webgl",
    "--disable-threaded-animation",
    "--disable-threaded-scrolling",
    "--disable-in-process-stack-traces",
    "--disable-histogram-customizer",
    "--disable-gl-extensions",
    "--disable-extensions",
    "--disable-composited-antialiasing",
    "--disable-canvas-aa",
    "--disable-3d-apis",
    "--disable-accelerated-2d-canvas",
    "--disable-accelerated-jpeg-decoding",
    "--disable-accelerated-mjpeg-decode",
    "--disable-app-list-dismiss-on-blur",
    "--disable-accelerated-video-decode",
    "--num-raster-threads=1",
];

export const COMMAND_SEPARATOR = "|";

export const EMPTY_SALT = Buffer.alloc(32, 0);
export const CRYPT_KEYS = Object.freeze({
    audio: "576861747341707020417564696f204b657973",
    document: "576861747341707020446f63756d656e74204b657973",
    image: "576861747341707020496d616765204b657973",
    ptt: "576861747341707020417564696f204b657973",
    sticker: "576861747341707020496d616765204b657973",
    video: "576861747341707020566964656f204b657973",
});
