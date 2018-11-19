import {createStackNavigator} from "react-navigation";
import PageLogin, { PageRegister } from "../PageLogin"

export default StackNavigator = createStackNavigator({
    PageLogin: { screen: PageLogin },
    PageRegister: { screen: PageRegister },

}, {
    initialRouteName: "PageLogin",
    navigationOptions: {header: null}
});