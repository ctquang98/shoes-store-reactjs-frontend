import * as types from '../constants/actionTypes';

let initialState = {
    categoryGenders: [],
    products: [],
    categoriesMen: [],
    categoriesWomen: [],
    categoriesUnisex: [],
    provinces: [],
    names: [],
    slides: [],
    allCategories: [],
    recommendProducts: [],
    popularProducts: []
};

const appReducer = (state = initialState, action) => {
    const { payload } = action;
    switch(action.type) {
        case types.GET_HOME_PAGE_DATA:
            state = {
                categoryGenders: payload.categoryGenders,
                products: payload.products,
                categoriesMen: payload.categorieNam,
                categoriesWomen: payload.categorieNu,
                categoriesUnisex: payload.categorieUnisex,
                provinces: payload.provinces,
                names: payload.names,
                slides: payload.slides,
                allCategories: payload.categoryAll,
                recommendProducts: payload.productRecommendation,
                popularProducts: payload.productPopular
            }
            return state;
        default: return state;
    }
}

export default appReducer;