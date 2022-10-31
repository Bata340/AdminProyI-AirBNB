import { Login, SignUp, Properties, PropertiesUpload, MyProperties, PropertiesEdit, PropertyView, MyPropertiesRequests } from '../pages';
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
					<Route exact path="/properties/admin-my-props" element={<MyProperties/>}/>
					<Route exact path="/properties/edit" element={<PropertiesEdit/>}/>
					<Route exact path="/property" element={<PropertyView/>}/>
					<Route exact path="/Properties/Requests" element={<MyPropertiesRequests/>}/>
				</Switch>
			</Router>
		</>
	);
}


export default ReactRoutes;
