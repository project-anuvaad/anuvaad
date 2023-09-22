export const shouldTypeRTL = (lang_code) => {
    let RTL_lang_codes = ["ur", "ks", "sd"]
    if(RTL_lang_codes.includes(lang_code)){
        return true
    }
    return false
}