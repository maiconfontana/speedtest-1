//@ts-check

class Config {
    static get OVERHEAD() {
        return {
            "TCP+IPv4+ETH": 1500 / (1500 - 20 - 20 - 14),
            "TCP+IPv6+ETH": 1500 / (1500 - 40 - 20 - 14)
        };
    }

    static get defaultConfig() {
        return {
            ignoreErrors: true,
            optimize: false,
            xhr: {
                protocol: self.location.protocol.replace(":", ""),
                host: `${self.location.host}`
            },
            overheadCompensation: Config.OVERHEAD["TCP+IPv4+ETH"],
            ip: {
                path: "ip"
            },
            latency: {
                xhr: {
                    path: "ping"
                },
                count: null,
                delay: 0,
                duration: 5,
                gracetime: 1
            },
            download: {
                xhr: {
                    path: "download",
                    streams: 6,
                    delay: 150,
                    size: 20 * 1024 * 1024,
                    responseType: "arraybuffer" // "arraybuffer" or "blob"
                },
                delay: 2,
                duration: 10,
                gracetime: 2
            },
            upload: {
                xhr: {
                    path: "upload",
                    streams: 6,
                    delay: 150,
                    size: 1 * 1024 * 1024
                },
                delay: 2,
                duration: 10,
                gracetime: 2
            }
        };
    }

    static loadConfig() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("GET", "/config.json", true);
            xhr.onload = () => {
                const config = this.extend(
                    this.defaultConfig,
                    JSON.parse(xhr.response)
                );
                config.xhr.endpoint = `${config.xhr.protocol}://${
                    config.xhr.host
                }`;
                resolve(config);
            };
            xhr.onerror = () =>
                reject("Could not load configuration file (config.json)");
            xhr.send();
        });
    }

    static extend(...objects) {
        const extended = {};
        let i = 0;

        const merge = object => {
            for (const property in object) {
                if (!object.hasOwnProperty(property)) {
                    continue;
                }

                if (Object.prototype.isPrototypeOf(object[property])) {
                    extended[property] = this.extend(
                        extended[property],
                        object[property]
                    );
                    continue;
                }

                extended[property] = object[property];
            }
        };

        for (; i < objects.length; i++) {
            merge(objects[i]);
        }

        return extended;
    }
}

export default Config;
