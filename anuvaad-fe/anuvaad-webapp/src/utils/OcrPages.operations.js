export function get_ocr_pages(data, page_number) {
    if (data['pages'] !== undefined) {
        return data.pages[0]
    }
    return [];
}

export function download_ocr_doc(data) {
    if (data['pages'] !== undefined) {
        return data.pages
    }
    return [];
}

export function get_bg_image(data, status, pageno) {
    if (status) {
        if (data.pages.length > 0) {
            return data.pages[0].regions[0]
        }
    }
    return "";
}