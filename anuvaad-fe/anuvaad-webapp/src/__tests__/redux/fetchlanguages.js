import fetchLanguages from '../../flux/reducers/fetchlanguages';
import C from '../../flux/actions/constants';

describe('Fetch Language',()=>{
    it('Should return default state',()=>{
        const newState = fetchLanguages(undefined, {});
        
        expect(newState).toEqual({})
    });
    it('Should return new state if receiving type',()=>{
        const languages = { _id: '5d7a0fcdb053d84641cebd1c',
        language_code: 'en',
        status: 'ACTIVE',
        created_on: '2019-09-12T09:28:45.367Z' }

        const newState = fetchLanguages(undefined, {
            type: C.FETCH_LANGUAGE,
            payload: languages
        });
        
        expect(languages).toEqual(newState)
    });
    
})