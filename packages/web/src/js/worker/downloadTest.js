import Uuid from "../utils/uuid";
import BandwidthTest from "./bandwidthTest";
import STEP from "./step";

export default class DownloadTest extends BandwidthTest {
  constructor() {
    super(STEP.DOWNLOAD);
  }

  /**
   * Prepapre the XHR object
   *
   * @param {*} index
   * @param {*} xhr
   * @param {*} params
   */
  initXHR(index, xhr, params) {
    this.sizeLoaded[index] = 0;
    const endpoint = `${this.test.config.endpoint.xhr}/${this.test.config.download.path}?${Uuid.v4()}&size=${
      params.size
    }`;
    xhr.timeout = 2000;
    xhr.open("GET", endpoint, true);
    return xhr;
  }

  /**
   * Send the XHR message
   *
   * @param {*} xhr
   */
  sendMessage(xhr) {
    xhr.send(null);
  }
}
