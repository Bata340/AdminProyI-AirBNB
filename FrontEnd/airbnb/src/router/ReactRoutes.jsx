import { Login, SignUp, Properties, PropertiesUpload } from '../pages';
import{ BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';

function checkTokenAuth(){
	const token = localStorage.getItem('sessionToken');
	return (token === true || token === 'true');
}

function ReactRoutes() {
	if(!checkTokenAuth()){
		return (
			<Router>
				<Switch>
					<Route path="/" element={<Login/>}/>
					<Route exact path="/sign-up" element={<SignUp/>}/>
				</Switch>
			</Router>
		)
	}
	return (
		<Router>
			<Switch>
				<Route exact path="/" element={<Properties/>}/>
				<Route exact path="/properties/add" element={<PropertiesUpload/>}/>
			</Switch>
		</Router>
	);
}


export default ReactRoutes;
