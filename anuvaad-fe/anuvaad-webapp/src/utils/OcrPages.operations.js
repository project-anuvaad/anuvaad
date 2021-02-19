export function get_ocr_pages(data, page_number) {
    if (data['pages'] !== undefined) {
        return data.pages[page_number - 1]
    }
    return [];
}

export function download_ocr_doc(data) {
    if (data['pages'] !== undefined) {
        return data.pages
    }
    return [];
}