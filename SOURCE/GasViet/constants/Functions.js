import { Linking, Platform } from "react-native";

function validatePhoneNumber(number) {
  var re = /(0)+([0-9]{9})\b/;
  return re.test(String(number));
}

export { validatePhoneNumber };

