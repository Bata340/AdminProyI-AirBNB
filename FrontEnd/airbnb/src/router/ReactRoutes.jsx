import { Login, SignUp, Properties, PropertiesUpload, MyProperties, PropertiesEdit, 
	PropertyView, MyPropertiesRequests, ReviewUsers, ReviewProperties, ExperiencesUpload,
	MyExperiences, ReservedProperties, Experiences, ReservedExperiences, ExperienceView, ExperiencesEdit,
	OwnersScheduleView, ExperiencesScheduleView } from '../pages';
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
					<Route exact path="/my-properties-reserved" element={<ReservedProperties/>}/>
					<Route exact path="/my-experiences-reserved" element={<ReservedExperiences/>}/>
					<Route exact path="/Properties/Requests" element={<MyPropertiesRequests/>}/>
					<Route exact path="/reviews/occupants" element={<ReviewUsers/>}/>
					<Route exact path="/reviews/properties" element={<ReviewProperties/>}/>
					<Route exact path="/experiences" element={<Experiences/>}/>
					<Route exact path="/experience" element={<ExperienceView/>}/>
					<Route exact path="/experiences/add" element={<ExperiencesUpload/>}/>
					<Route exact path="/experiences/admin-my-experiences" element={<MyExperiences/>}/>
					<Route exact path="/experiences/edit" element={<ExperiencesEdit/>}/>
					<Route exact path="/experiences/bookings" element={<ExperiencesScheduleView/>}/>
					<Route exact path="/properties/bookings" element={<OwnersScheduleView/>}/>
				</Switch>
			</Router>
		</>
	);
}

export default ReactRoutes;
