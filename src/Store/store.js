import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' ;
import thunk from "redux-thunk";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
      "token","isloggeduser","userdata","guestCartToken","guestShippingAddress",
      "guestIsValidShipping","guestBillingAddress","loggedInUserData","localEstimateShippingData",
      "createCartId","isGuestCartData","wilistProductId","recentSearchData","previousUrl", "guestSameAsShipping",
      "guestSavedBillingAddress", "isSearchResult", "cartDataAddress", "customerSameAsShipping", "selectedPaymentMethod",
      "isOrderComplete"
    ]
  }

const persistedReducer = persistReducer(persistConfig, reducer)

export const store= createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
  );
export const persister= persistStore(store);