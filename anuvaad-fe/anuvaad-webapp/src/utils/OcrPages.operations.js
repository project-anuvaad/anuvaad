export function get_ocr_pages(data) {
    let pages = []
    if (data['result'] !== undefined) {
        pages = data.result
        return pages
    }
    return pages;
}

export const get_ocr_lines = (data, page_no) => {
    let lines = []
    if (data['result'] !== undefined) {
        let pageDetail = data.result.pages.filter((page, i) => {
            return i === page_no
        })
        pageDetail[0].regions.forEach(region => {
            if (region.children) {
                lines.push(region.children)
            }
        })
    }

    return {
        lines
    }

}
