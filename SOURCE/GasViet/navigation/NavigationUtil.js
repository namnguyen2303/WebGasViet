import { NavigationActions, StackActions } from "react-navigation";

let _navigator; // eslint-disable-line

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}
function push(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params
    })
  );
}

function goBack(immediate) {
  // _navigator.goBack();
  _navigator.dispatch(NavigationActions.back({
    immediate:immediate
  }));
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  push,
};
