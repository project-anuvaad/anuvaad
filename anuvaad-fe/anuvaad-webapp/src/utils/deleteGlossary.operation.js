export const getBulkDeletionArray = (glossaryData, rowsToDelete) => {
    let rowsToBeDeleted = []
    glossaryData.result.forEach((val, i) => {
        rowsToDelete.forEach(row => {
            if (row.dataIndex === i) {
                rowsToBeDeleted.push({ src: val.src, tgt: val.tgt, locale: val.locale })
                rowsToBeDeleted.push({ src: val.tgt, tgt: val.src, locale: val.locale.split("|").reverse().join("|") })
            }
        })
    })
    return rowsToBeDeleted;
}

export const isOrg = (glossaryData, rowsToBeDelete) => {
    let isOrg = false
    glossaryData.result.forEach((val, i) => {
        rowsToBeDelete.forEach(row => {
            if (row.dataIndex === i && val.typeOfGlossary === "Organization") {
                isOrg = true
            }
        })
    })
    return isOrg;
}