import { Button, Container, TextField, Grid, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PhotoProperty } from '../PropertiesEdit/PhotoProperty';
import Carousel from 'react-material-ui-carousel'

const settingsSlider = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
    swipeToSlide: true,
    edgeFriction: 0.15,
 };

export const PropertyView = (props) => {

    const [searchParams] = useSearchParams();
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [reservationDates, setReservationDates] = useState([]);
    const [readonlyCheckout, setReadonlyCheckOut] = useState(true);
    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [property, setProperty] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        if(!checkin || !checkout){
            setShowErrorDialog(true);
        }
        const paramsPost = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id":searchParams.get("id"),
                "userid": localStorage.getItem("username"),
                "dateFrom": checkin.toISOString().substr(0,10),
                "dateTo": checkout.toISOString().substr(0,10)
            })
        };
        const url = `${API_URL}/property/reserve/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsPost
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                setShowDialog(true);
            }
        }
    }

    const goBackToHome = (event) => {
      navigate('/');
    }


    const getInvalidDates = async (id) => {
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/property/reserveDates/${id}?type=accepted`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const url = `${API_URL}/property/reserveDates/${id}?type=requested`;
                const responseTwo = await fetch(
                    url,
                    paramsGet
                );
                const jsonResponseTwo = await responseTwo.json();
                if (responseTwo.status === 200){
                    if(!jsonResponseTwo.status_code){
                        const reservationD = jsonResponse.message.concat(jsonResponseTwo.message);
                        setReservationDates(reservationD);
                    }
                }
            }
        }
    }


    const getDataForFields = async (id) => {
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/property/${id}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){

                setPhotosNamesHashed(jsonResponse.message.photos);
                setProperty(jsonResponse.message);
            }
        }
    }


    const isInvalidDateCheckIn = (date) => {
        let isInvalid = false;
        const dateFormatted = date.toISOString().substr(0,10);
        const dateToCompare = new Date(dateFormatted);
        if( dateToCompare <= new Date()){
            return true;
        }
        for (let i=0; i<reservationDates.length; i++){
            const dateObject = reservationDates[i];
            const dateFrom = new Date(dateObject.dateFrom);
            const dateTo = new Date(dateObject.dateTo);
            if( dateFrom <= dateToCompare && dateToCompare <= dateTo ){
                isInvalid = true;
                break;
            }
            
        }
        return isInvalid;
    }

    const getMaxDateCheckout = () => {
        let leastDifferenceBetweenDates = null;
        let maxDate = null;
        const dateCheckin = new Date(checkin.toISOString().substr(0,10));
        
        for (let i=0; i<reservationDates.length; i++){
            const dateObject = reservationDates[i];
            const dateFrom = new Date(dateObject.dateFrom);
            const dateTo = new Date(dateObject.dateTo);
            if( 
                dateFrom >= dateCheckin && 
                ( maxDate === null || ( leastDifferenceBetweenDates > (dateFrom - dateCheckin) ))
            ){
                maxDate = dateFrom;
                leastDifferenceBetweenDates = (dateFrom - dateCheckin);
            }
        }
        return maxDate;
    }

    const isInvalidCheckout = (date) => {
        const dateFormatted = date.toISOString().substr(0,10);
        const dateToCompare = new Date(dateFormatted);

        // Resto 1 a la fecha porque sino no me deja seleccionar el mismo dia de checkin
        const dateAsDate = new Date((checkin).toISOString());
        dateAsDate.setDate(dateAsDate.getDate()-1);
        const maxDate = getMaxDateCheckout();
        return ( (maxDate !== null && dateToCompare >= maxDate) || (dateToCompare < dateAsDate) )
    }


    useEffect(() => {
        getDataForFields(searchParams.get("id"));
        getInvalidDates(searchParams.get("id"));
    }, []);



  return (
    <>
        <form onSubmit = {onSubmit}>
            
            <Container spacing={12}  sx={{ width: '80%' }} id="formWrapper">

                <Grid container item xs={1} className={"buttonClass"} marginBottom={5}>
                        <Button type="button" variant="contained" color="error"   onClick={goBackToHome}>Back</Button>
                </Grid>
                <Grid container item xs={12}>
                <Grid container item xs={6} sx={{marginRight:"2rem"}}>
                    <Carousel sx={{width:"80%", margin:"auto", justifyContent:"center"}}>
                        {
                            photosNamesHashed.map((slideImage, index) => {
                                return(
                                    <Grid
                                        key={index}
                                        container
                                        justify-content="center"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <PhotoProperty  nameImage={slideImage} read={true} onRemoveImage = {null}/>
                                    </Grid>
                                );
                            })
                        }
                    </Carousel>
                </Grid>
                
                <Grid container item xs={5} className={"LogoContainer"} >
                    <Grid container item xs={12} sx={{borderBottom:"1px solid black", marginBottom:"1.5rem"}}>
                        <h1 sx={{fontWeight:"bold", wordWrap:"break-word"}}>{property.name}</h1>
                    </Grid>   
                    <Grid container item xs={12}>
                        <Container sx={{textAlign:"left"}}>
                            <h2>
                                <strong>U$D {property.price}</strong>
                                <span style={{fontSize:"15px", marginLeft:5}}> Per night</span>
                            </h2>
                            
                        </Container>
                    </Grid> 
                    <Grid container item xs={12} sx={{marginTop:"1.5rem"}}>
                        <Container sx={{textAlign:"left", border:"1px solid gray", borderRadius:"10px", backgroundColor:"lightgray", paddingTop:"5px"}}>
                            <p style={{wordWrap:"break-word"}}>{property.description}</p> 
                        </Container>
                    </Grid> 
                    <Grid container item xs={12} sx={{marginTop:"1.5rem"}}>
                        <Container sx={{textAlign:"left"}}>
                            <Rating readOnly value={property.score || 0} name="scoreProperty"/>
                            <Typography>{property.numOfVotes} opinion{props.numOfVotes !== 1? "s" : null}</Typography>
                        </Container>
                    </Grid> 
                    
                    
                    
                    
                </Grid>
                
                <Grid container 
                     margin={10}>
                    <LocalizationProvider  dateAdapter={AdapterDayjs } >
                    <Grid container justifyContent="center"  item xs={6}>
                        <DatePicker 
                            id="checkin"
                            label="Check-In"
                            inputFormat="DD/MM/YYYY"
                            value={checkin || null}
                            onChange={(event) => {
                                setCheckin(event); 
                                if ( event ){
                                    setReadonlyCheckOut(false);
                                }else{
                                    setReadonlyCheckOut(true);
                                }
                            }}
                            shouldDisableDate={isInvalidDateCheckIn}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid container justifyContent="center"  item xs={6}>
                        <DatePicker
                            id="checkout"
                            label="Check-Out"
                            inputFormat="DD/MM/YYYY"
                            readOnly={readonlyCheckout}
                            value={checkout || null}
                            onChange={(event) => {
                                if(!isInvalidCheckout(event)){
                                    setCheckout(new Date(event.toISOString()));
                                }else{
                                    setCheckout(null);
                                }
                                setCheckout(event);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            shouldDisableDate={isInvalidCheckout}
                        />
                    </Grid>
                        
                    
                    </LocalizationProvider>
                </Grid>
                <>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Book this property</Button>
                    </Container>
                    
                </>
                
                </Grid>
                
            </Container>
        </form>

        <Dialog
            open={showDialog}
            onClose={goBackToHome}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Booking was succesful"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You have booked this property succesfully. 
                <br/>
                <strong>Now you just need to be accepted by the owner of the property</strong>. 
                <br/><br/>
                We will return you to the homepage after closing this dialog.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {goBackToHome()}}>OK</Button>
            </DialogActions>
      </Dialog>

      <Dialog
            open={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Error: Booking not completed."}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Something went wrong with your booking. Check the Check-In and Check-Out dates in order to continue.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
            </DialogActions>
      </Dialog>
    </>
  )
}