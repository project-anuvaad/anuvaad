import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { jsPDF } from "jspdf";

const downloadReportClick = async (downloadAll = false, type, downloadElements=[], chartName) => {
    const filter = (node) => {
        const exclusionClasses = ['exportButtons'];
        return !exclusionClasses.some((classname) => node.classList?.contains(classname));
      }

    if (type === "img") {
        let downloadEle = document.getElementById(downloadElements[0]);
        htmlToImage.toPng(downloadEle, {filter: filter}).then(function (dataUrl) {
            download(dataUrl, chartName + ".png");
        }).catch((err) => {
            console.log("unable to download.");
        })
    } else if (type === "pdf") {
        let doc = new jsPDF({
            orientation: "landscape",
        });

        const savePDF = async () => {
            doc.save(chartName + ".pdf");
        }
        const addImage = async (src, width, height, alias) => {
            doc.addImage(src, "png", 0, 0, width, height, alias, "FAST");
            doc.addPage()
        }
        const generateImages = async () => {
            for (let i = downloadElements.length; i >= 0; i--) {
                let el = downloadElements[i];
                let imageEle = document.getElementById(el);
                let width = doc.internal.pageSize.getWidth();
                let height = doc.internal.pageSize.getHeight();
                htmlToImage.toPng(imageEle, {filter: filter}).then(async function (dataUrl) {
                    let image = new Image();
                    image.src = dataUrl;
                    image.onload = async function () {
                        await addImage(this, width, height, el + "-" + i);
                        if (i === 0) {
                            await savePDF();
                        }
                    }
                }).catch((err) => {
                    console.log("unable to download.");
                })
            }
        }

        await generateImages();
    }
}

export default downloadReportClick;