var jp                = require('jsonpath')

export const get_language_name = (languages, language_code, translate)  => {
    let condition   = translate ? `$..[?(@.status == 'ACTIVE' && @.target_language_code == '${language_code}' && @.is_primary==true)]` :  `$..[?(@.status == 'INACTIVE' && @.target_language_code == '${language_code}' && @.is_primary==true)]` ;
    let language    = jp.query(languages, condition)
    if (language.length > 0) {
        return language[0].target_language_name
    }
    return 'UNKNOWN'
}

export const get_supported_languages = (languages, translate) => {
    let condition   = translate ? `$..[?( @.status == 'ACTIVE' && @.is_primary == true)]` : `$..[?(@.status == 'INACTIVE' && @.is_primary == true)]`
    let result      = jp.query(languages, condition)
    if (result.length > 0) {
        return result.map((lang) => { return {language_code: lang.source_language_code, language_name: lang.source_language_name} }).filter((v,i,a)=>a.findIndex(t=>(t.language_code === v.language_code))===i)
    }
    return []
}

export const get_counterpart_languages = (languages, language_code, translate) => {
    let condition   = translate ?`$..[?( @.status == 'ACTIVE' && @.source_language_code == '${language_code}' && @.is_primary== true)]` :`$..[?(@.source_language_code == '${language_code}' && @.is_primary== true && @.status == 'INACTIVE' )]`
    let result      = jp.query(languages, condition)
    return result.map((lang) => { 
        return {
            source_language_code: lang.source_language_code, 
            source_language_name: get_language_name(languages, lang.source_language_code, translate),

            language_code: lang.target_language_code,
            language_name: get_language_name(languages, lang.target_language_code, translate)
        } 
    })
}

export const get_nmt_models = (models, source_language, target_language_code) => {
    let condition   = `$..[?(  @.source_language_code == '${source_language}' && @.status == 'ACTIVE' && @.target_language_code == '${target_language_code}')]`;
    let result      = jp.query(models, condition)
    return result
}

export const get_model_list = (user, modelList, model_selected) =>{
    let new_val     = []
    if(user.models && user.models.length>0){
        user.models.map(model=>{
            if(model.src_lang   === model_selected.source_language_code && model.tgt_lang === model_selected.target_language_code){    
            }
            else{
                new_val.push(model)
            }
        })
        
    }

    let val = {}
    val.src_lang = model_selected.source_language_code
    val.tgt_lang = model_selected.target_language_code
    val.uuid     = model_selected.uuid

    new_val.push(val)


return new_val
}


export const get_filter_model = (models, source_language, target_language_code, model) => {

    let condition   = `$..[?(  @.source_language_code == '${source_language}' && @.target_language_code == '${target_language_code}')]`;
    let result      = jp.query(models, condition)
    return result
}



export const get_model_details = (languages, source_language_code, target_language_code, models) => {
    let result = []
    if(models){
        let condition       =   `$..[?(@.src_lang == '${source_language_code}'  && @.tgt_lang == '${target_language_code}')]`
    let res        =   jp.query(models, condition)
    result = res;
    }
    let res_data        =   ""
        if(result.length > 0){
            let model_condition = result.length > 0 && `$..[?(@.uuid == '${result[0].uuid}'&& @.status == 'ACTIVE')]`
            res_data    = jp.query(languages, model_condition)
            res_data    = res_data[0]
        }
        if(!res_data) {
        let condition   =   `$..[?(@.source_language_code == '${source_language_code}' && @.is_primary == true && @.target_language_code == '${target_language_code}')]`
        let result      =   jp.query(languages, condition)
            if (result.length === 1) {
                res_data = result[0]
            }
        }
    return res_data
   
    
}

export const get_users = (models,uuid) =>{
    let condition   =   `$..[?(@.uuid == '${uuid}')]`
        let result      =   jp.query(models, condition)
    return result.length>0 ? true : false
}

export const get_selected_users = (userDetails, uuid) =>{
    let result = userDetails.filter(user => (user.is_active && (user.roles !== 'ADMIN')&&user.models && get_users(user.models,uuid) ))
    return result;
}

export const fetchModel = (modelId, docs) => {
    let model = ""
    if (docs && docs.length > 0) {
      let condition = `$[?(@.model_id == '${modelId}')]`;
      model = jp.query(docs, condition)
      if(model[0].status==="INACTIVE"){
        let condition = `$[?(@.source_language_code == '${model[0].source_language_code}' && @.target_language_code =='${model[0].target_language_code}' && @.status === "ACTIVE" && @.is_primary === true)]`;
        model = jp.query(docs, condition)
      }
      
    }

    return model.length > 0 ? model[0] : null
  }
