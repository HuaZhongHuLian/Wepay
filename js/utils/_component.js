import { Build, promiseInitBuild } from "./Build"
import { Label, Touch, StateBar, NavBar, Button, Button1, Input} from "./Component"
import { Dialog } from "./Dialog"
import { Jpp, Color, Layout, Jx } from "./Jx"
import { Login } from "./Login"
import { NavComponent } from "./NavComponent"
import { Navigator } from "./Navigator"
import { Net } from "./Net"
import { Storage } from "./Storage"
import { Util } from "./Util"


import {Icons} from "../../res/images/_icons";
import {Images} from "../../res/pictures/_images";
import {Bankcards} from "../../res/bank_card_icon/_bankcard";


// 改成 index.js
// package.json {"name": "components"}
// var Components = {
export {
Icons,Images,Bankcards,
// Build
Build,
promiseInitBuild,
// Component
Label,
Touch,
StateBar,
NavBar,
Button,
Button1,
Input,
// Dialog
Dialog,
// Jx
Jpp,
Color,
Layout,
Jx,
// Login
Login,
// NavComponent
NavComponent,
// Navigator
Navigator,
// Net
Net,
// Storage
Storage,
// Util
Util,

};
// module.exports = Components;