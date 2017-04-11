import JSZip from 'jszip';
import { _ } from 'meteor/underscore';

const downloads = {
  makeImageArchive(chartImages) {
    const zip = new JSZip();
    chartImages.forEach(chart => {
      const { image, chartName, chartType, chartId } = chart;
      let fileName = `${chartName}_${chartType}.png`;
      if (zip.file(fileName)) {
        fileName = `${chartName}_${chartType}_${chartId}.png`;
      }
      zip.file(fileName, image, { base64: true });
    });
    return zip;
  },

  downloadImages(chartsToExport) {
    const charts = _.values(chartsToExport);
    const { exportName } = charts[0];
    if (charts.length === 1) {
      this.createDownload(base64toBlobBytes(charts[0].image), 'png', exportName);
    } else {
      const zip = this.makeImageArchive(charts);
      zip.generateAsync({
        type: 'uint8array',
        compression: 'DEFLATE',
      })
        .then(content => {
          this.createDownload([content], 'zip', `${exportName}_charts`);
        });
    }
  },

  createDownload(content, type, fileName) {
    let fileType;
    switch (type) {
      case 'zip':
        fileType = 'application/zip, application/octet-stream';
        break;
      case 'png':
        fileType = 'image/png';
        break;
      default:
        return;
    }
    const blob = new Blob(content, { type: fileType });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objUrl;
    link.download = `${fileName}.${type}`;
    link.style.display = 'none';
    const parentElement =  document.getElementById('export-image-menu-item') || document.body;
    parentElement.appendChild(link);
    link.click();
    parentElement.removeChild(link);
    URL.revokeObjectURL(objUrl);
  },
  copyTextToClipboard(Notificator, text) {
    const textArea = document.createElement('textarea');
    textArea.style = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '2em',
      height: '2em',
      padding: 0,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent',
    };
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        Notificator.snackbar('Successfully copied to clipboard', 'positive');
      } else {
        Notificator.important(`Please copy manually: ${text}`, 'Unable to copy');
      }
    } catch (err) {
      Notificator.important(`Please copy manually: ${text}`, 'Unable to copy');
    }
    document.body.removeChild(textArea);
  },
};

export default downloads;

function base64toBlobBytes(base64Data) {
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return byteArrays;
}
