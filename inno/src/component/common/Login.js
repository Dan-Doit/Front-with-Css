import React from 'react';
import '../../resource/static/css/login.css';
import { sha256 } from 'js-sha256';
import {useLazyQuery} from "@apollo/client";
import {LOGIN} from "../../graphql/login";

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

function LoginQueryBtn({refID, refPW}) {

	const [doLogin, {loading, data}] = useLazyQuery(LOGIN)

	if (loading) return null;

	if (data) {
		if(data.login.errors.length){
			alert(data.login.errors[data.login.errors.length-1].errtext)
			sessionStorage.clear()
		} else {
			sessionStorage.setItem('id', refID.current?.value)
			sessionStorage.setItem('token', data.login.token)
			sessionStorage.setItem('group_name', "Admin")
			sessionStorage.setItem('group_id', 1000)
			window.location.reload()
		}
		refPW.current.value = ""
	}

	return (
		<button className="login_btn"
			onClick={()=> doLogin({
				variables: {
					id: refID.current.value,
					password: bcrypt.hashSync(sha256(refPW.current.value), salt)
				},
				fetchPolicy: 'no-cache',
				errorPolicy: 'none'
			})}
			onSubmit={(e) => {
				e.preventDefault();
				return false
			}}
			>Login
		</button>
	)
}

export function LoginForm({refID, refPW}) {
	return (
		<>
			<div className="login_header">
				<div className="login_header_tit">
					<p className="login_copyright">CA-Cloud 1.0 Copyright (C) 2019 Innogrid. All rights reserved.</p>
				</div>
			</div>
			<div className="login_main">
				<div className="login_cont">
					<div className="login_tit">Welcome! CA-Cloud Admin Dashboard</div>
					<p>Ask to admin for sign up</p>
					<div className="login_form">
						<form method="post">
							<input type="text" id="user_id" name="user_id" className="login_input" ref={refID} placeholder="User Name" />
							<input type="password" id="user_password" name="user_password" className="login_input" ref={refPW} placeholder="Password" />
							<label className="login_check">
								<input type="checkbox" id="" name=""/>
								Remember Me
							</label>
							<LoginQueryBtn refID={refID} refPW={refPW}/>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}

function Login() {
	var userId = React.createRef()
	var userPassword = React.createRef();

	return <LoginForm refID={userId} refPW={userPassword}/>
}

export default Login;
