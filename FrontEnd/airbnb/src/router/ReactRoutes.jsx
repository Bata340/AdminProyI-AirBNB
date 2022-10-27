import { Login, SignUp, Properties, PropertiesUpload } from '../pages';
import { NavBar } from '../common/Navbar/Navbar';
import{ BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';
import '../common/common.css';

function ReactRoutes() {
	return (
		<>
			<br/>
			<br/>
			<br/>
			<NavBar/>
			<Router style={{marginBottom:30}}>
				<Switch>
					<Route exact path="/" element={<Properties/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route exact path="/sign-up" element={<SignUp/>}/>
					<Route exact path="/properties/add" element={<PropertiesUpload/>}/>
				</Switch>
			</Router>
		</>
	);
}


export default ReactRoutes;
