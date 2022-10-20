import { Login, Home, SignUp, Properties } from '../pages';
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
				<Route exact path="/" element={<Home/>}/>
				<Route exact path="/properties" element={<Properties/>}/>
			</Switch>
		</Router>
	);
}


export default ReactRoutes;
