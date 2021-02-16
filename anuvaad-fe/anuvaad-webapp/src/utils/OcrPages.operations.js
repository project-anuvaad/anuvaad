export function get_ocr_pages(data, page_number) {
    if (data['pages'] !== undefined) {
        return data.pages[page_number - 1]
    }
    return [];
}

