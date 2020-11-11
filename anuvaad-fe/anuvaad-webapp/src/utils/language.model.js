var jp                = require('jsonpath')

export const get_language_name = (languages, language_code)  => {
    let condition   = `$..[?(@.language_code == '${language_code}')]`
    let language    = jp.query(languages, condition)
    if (language.length === 1) {
        return language[0].language_name
    }
    return 'UNKNOWN'
}

export const get_supported_languages = (languages) => {
    return languages.map((lang) => { return {language_code: lang.language_code, language_name: lang.language_name} })
}

export const get_counterpart_languages = (languages, models, language_code) => {
    let condition   = `$..[?(@.source_language_code == '${language_code}' && @.is_primary== true)]`
    let supported   = jp.query(models, condition)
    return supported.map((lang) => { 
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
        return language[0].model_id
    }
}
