import React from 'react';
import {useQuery} from "@apollo/client"
import {CHKTOK} from "../../graphql/login";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import {
    Login,
    Resource,
    Server,
    NetworkSubnet,
    NetworkAdaptiveIP,
    ManagementUser,
    ManagementQuota,
    ManagementBilling,
} from '../../config/path';
import Menu from './Menu';
import MenuUserInfo from './MenuUserInfo';
import LogoImage from '../../resource/static/images/header_logo.png';

export function CheckToken({token}) {
    const {loading, error, data} = useQuery(CHKTOK, {
        variables: { token },
        fetchPolicy: 'no-cache',
        errorPolicy: 'none'
    })

    if (loading)
        return <></>;

    if (error)
        sessionStorage.clear()

    if (data) {
        if (data.check_token.errors.length) {
            alert(data.check_token.errors[data.check_token.errors.length-1].errtext)
            sessionStorage.clear()
        }

        if (data.check_token.isvalid) {

            return (
                <Router basename="/admin">
                    <header className="header_common">
                        <div className="header_tit">
                        {/* <img className="logo" src={Logo} alt="logo"/> */}
                            <img className="title" src={LogoImage} alt="CA-Cloudit"/>
                        </div>
                        <div className="header_cont">
                            <MenuUserInfo/>
                        </div>
                        <nav>
                            <Menu/>
                        </nav>
                    </header>
                    <main className="main_common">
                        <Switch>
                            <Redirect exact from="/login" to="/resource" />
                            <Redirect exact from="/" to="/resource" />
                            <Route path="/resource" component={Resource} exact />
                            <Route path="/server" component={Server} exact />
                            <Route path="/network" component={NetworkSubnet} exact />
                            <Route path="/network/subnet" component={NetworkSubnet}/>
                            <Route path="/network/adaptiveip" component={NetworkAdaptiveIP}/>
                            <Route path="/management" component={ManagementUser} exact />
                            <Route path="/management/user" component={ManagementUser}/>
                            <Route path="/management/quota" component={ManagementQuota}/>
                            <Route path="/management/billing" component={ManagementBilling}/>
                        </Switch>
                    </main>
                </Router>
            )
        }
    }

    return (
        <Router basename="/" >
            <Redirect to="/login"/>
            <Route path="/login" component={Login} />
        </Router>
    )
}