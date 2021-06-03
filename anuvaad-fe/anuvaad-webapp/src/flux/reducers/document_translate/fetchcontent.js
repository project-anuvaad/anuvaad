import C from "../../actions/constants";

const initialUserState = {
  result: []
};

function getTimeSpent(time_spent) {
  let h, m, s;
  let time_spent_ms;
  if (time_spent) {
    h = Math.floor(time_spent / 1000 / 60 / 60);
    m = Math.floor((time_spent / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((time_spent / 1000 / 60 / 60 - h) * 60 - m) * 60);
    s < 10 ? s = `0${s}` : s = `${s}`
    m < 10 ? m = `0${m}` : m = `${m}`
    h < 10 ? h = `0${h}` : h = `${h}`
    time_spent_ms = `${h}:${m}:${s}`
  } else {
    time_spent_ms = '-'
  }
  return time_spent_ms
}

function getUserContent(data) {
  let sentence = []
  data.hasOwnProperty('data') && data.data.forEach(data => {
    data.hasOwnProperty('text_blocks') && data.text_blocks.forEach(token => {
      token.hasOwnProperty('tokenized_sentences') && token.tokenized_sentences.forEach(val => {
        if (val.save) {
          sentence.push({
            s0_src: val.s0_src,
            s0_tgt: val.s0_tgt,
            tgt: val.tgt,
            bleu_score: val.bleu_score ? Math.round(val.bleu_score * 100) / 100 : '-',
            time_spent: getTimeSpent(val.time_spent_ms),
            rating_score: val.rating_score ? val.rating_score : '-'
          })
        }
      })
    })
  })
  return sentence
}

function removeSpaces(actionPayload) {
  actionPayload.hasOwnProperty('data') && actionPayload.data.forEach(data => {
    if (data.text_blocks) {
      data.hasOwnProperty('text_blocks') && data.text_blocks.forEach(text_blocks => {
        text_blocks.text = text_blocks.text.toString().replace(/\s{2,}/g, " ").trim()
        if (text_blocks.children) {
          text_blocks.hasOwnProperty('children') && text_blocks.children.forEach(children => {
            if (children.text) {
              children.text = children.text.toString().replace(/\s{2,}/g, " ").trim()
              if (children.children) {
                children.hasOwnProperty('children') && children.children.forEach(nestedChild => {
                  nestedChild.text = nestedChild.text.toString().replace(/\s{2,}/g, " ").trim()
                })
              }
            }
          })
        }
      })
    }
  })
  return actionPayload
}
export default function (state = initialUserState, action) {
  switch (action.type) {
    case C.FETCH_CONTENT:
      let result = state.result;
      let status = false, i, pageD;
      if (result !== null && result.data) {
        action.payload.hasOwnProperty('data') && action.payload.data.map(payloadData => {
          result.hasOwnProperty('data') && result.data.map((pageDetails, index) => {
            if (pageDetails.page_no === payloadData.page_no) {
              pageDetails = payloadData;
              status = true;
              i = index;
              pageD = payloadData;
            }
            return null;
          });
          if (status) {
            result.data[i] = pageD
            status = false;
          } else {
            result.data = result.data.concat(payloadData);
          }
          return null;
        });
      } else {
        result = action.payload;
      }
      return {
        ...state,
        result: removeSpaces(result)
      };

    case C.CLEAR_CONTENT:
      return initialUserState;

    case C.FETCH_USER_CONTENT:
      return {
        ...state,
        data: getUserContent(action.payload),
      }

    default:
      return state;
  }
}
