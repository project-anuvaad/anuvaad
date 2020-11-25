var jp                = require('jsonpath')

export const get_language_name = (languages, language_code)  => {
    let condition   = `$..[?(@.source_language_code == '${language_code}' && @.is_primary==true)]`
    let language    = jp.query(languages, condition)
    if (language.length > 0) {
        return language[0].source_language_name
    }
    return 'UNKNOWN'
}

export const get_supported_languages = (languages) => {
    let condition   = `$..[?(@.is_primary==true)]`
    let result      = jp.query(languages, condition)
    if (result.length > 0) {
        return result.map((lang) => { return {language_code: lang.source_language_code, language_name: lang.source_language_name} }).filter((v,i,a)=>a.findIndex(t=>(t.language_code === v.language_code))===i)
    }
    return []
}

export const get_counterpart_languages = (languages, language_code) => {
    let condition   = `$..[?(@.source_language_code == '${language_code}' && @.is_primary== true)]`
    let result      = jp.query(languages, condition)
    return result.map((lang) => { 
        return {
            source_language_code: lang.source_language_code, 
            source_language_name: get_language_name(languages, lang.source_language_code),

            language_code: lang.target_language_code,
            language_name: get_language_name(languages, lang.target_language_code)
        } 
    })
}

export const get_model_details = (languages, source_language_code, target_language_code) => {
    let condition   = `$..[?(@.source_language_code == '${source_language_code}' && @.is_primary == true && @.target_language_code == '${target_language_code}')]`
    let language    = jp.query(languages, condition)
    if (language.length === 1) {
        return language[0]
    }
}
