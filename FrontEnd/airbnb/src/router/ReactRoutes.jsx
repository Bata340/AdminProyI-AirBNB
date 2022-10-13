import { Login, Home } from '../pages';
import{ BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';

function checkTokenAuth(){
	const token = localStorage.getItem('sessionToken');
	if (!token){
		return false;
	}
	return true;
}

function ReactRoutes() {
	if(!checkTokenAuth()){
		return (
			<Router>
				<Login/>
			</Router>
		)
	}
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Home}/>
			</Switch>
		</Router>
	);
}


export default ReactRoutes;
