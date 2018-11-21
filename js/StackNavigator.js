import React from "react"
import {createStackNavigator} from "react-navigation";
import PageLogin, { PageRegister } from "./PageLogin"
import { Navigator, Login } from "./utils/_component";

class PageAutoLogin extends React.PureComponent{
    constructor(props){
        super(props);
        Navigator.push(this.props.navigation);
        Login.setAutoLogin(this.onAutoLogin.bind(this));
        Login.setPageLogin(this.onPageLogin.bind(this));
    }

    onPageLogin(){
        Navigator.renavigate(this.props.navigation, "PageLogin");
    }

    onAutoLogin(user){
        Navigator.renavigate(this.props.navigation, "PageHome");
    }

    render(){
        return <View />
    }
}
export const StackNavigator = createStackNavigator({
    PageLogin: { screen: PageLogin },
    PageRegister: { screen: PageRegister },
}, {
    initialRouteName: "PageLogin",
    navigationOptions: {header: null}
});