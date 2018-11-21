import {createStackNavigator} from "react-navigation";
import PageLogin, { PageRegister } from "./PageLogin"

export const StackNavigator = createStackNavigator({
    PageLogin: { screen: PageLogin },
    PageRegister: { screen: PageRegister },

}, {
    initialRouteName: "PageLogin",
    navigationOptions: {header: null}
});