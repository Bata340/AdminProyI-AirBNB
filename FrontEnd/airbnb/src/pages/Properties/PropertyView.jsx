import { Button, Container, TextField, Grid, Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

    const [showErrorPropertyEdit, setShowErrorPropertyEdit] = useState(false);
    const [erorPropertyEdit, setErrorPropertyEdit] = useState('');


    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [property, setProperty] = useState('');

    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmit = async (event) => {

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
        const url = `${API_URL}/property/reserveDates/${id}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                setReservationDates(jsonResponse.message);
            }else{
                setErrorPropertyEdit(jsonResponse.detail);
                setShowErrorPropertyEdit(true);
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
            }else{
                setErrorPropertyEdit(jsonResponse.detail);
                setShowErrorPropertyEdit(true);
            }
        }
    }


    const isInvalidDateCheckIn = (date) => {
        let isInvalid = false;
        const dateFormatted = date.toISOString().substr(0,10);
        const dateToCompare = new Date(dateFormatted);
        for (let i=0; i<reservationDates.length; i++){
            const dateObject = reservationDates[i];
            const dateFrom = new Date(dateObject.dateFrom);
            const dateTo = new Date(dateObject.dateTo);
            if( dateFrom <= dateToCompare && dateToCompare <= dateTo ){
                isInvalid = true;
                break;
            }
            if( dateToCompare <= new Date()){
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
        return ( (dateToCompare >= getMaxDateCheckout()) || (dateToCompare < dateAsDate) )
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
    </>
  )
}