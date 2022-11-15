import { Button, Container, TextField, Grid, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PhotoExperience } from '../ExperiencesEdit/PhotoExperience';
import Carousel from 'react-material-ui-carousel';
import { PaymentDialog } from "../../common/BookingDialog/PaymentDialog";

export const ExperienceView = () => {
    const [searchParams] = useSearchParams();
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [reservationDates, setReservationDates] = useState([]);
    const [checkin, setCheckin] = useState(null);
    const [experience, setExperience] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        if(!checkin){
            setShowErrorDialog(true);
        }else{
            setShowDialog(true);
        }
    }


    const paymentAndReservation = async () => {
        const paramsPost = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id":searchParams.get("id"),
                "userid": localStorage.getItem("username"),
                "dateFrom": checkin.toISOString().substr(0,10),
                "dateTo": checkin.toISOString().substr(0,10)
            })
        };
        const url = `${API_URL}/experience/reserve/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsPost
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(jsonResponse.status_code){
                throw new Error("Error Code: "+jsonResponse.status_code);
            }else{
                window.dispatchEvent(new Event('payment'));
                return;
            }
        }
        throw new Error("Error Code: "+jsonResponse.status_code);
    }


    const goBackToHome = (event) => {
      navigate('/experiences/');
    }


    /*const getInvalidDates = async (id) => {
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
    }*/


    const getDataForFields = async (id) => {
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/experience/${id}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                setPhotosNamesHashed(jsonResponse.photos);
                setExperience(jsonResponse);
            }
        }
    }


    const isInvalidDateCheckIn = (date) => {
        let isInvalid = false;
        const dateFormatted = date.toISOString().substr(0,10);
        const dateToCompare = new Date(dateFormatted);
        dateToCompare.setDate(dateToCompare.getDate()+1);
        if( dateToCompare <= new Date()){
            return true;
        }
        /*for (let i=0; i<reservationDates.length; i++){
            const dateObject = reservationDates[i];
            const dateFrom = new Date(dateObject.dateFrom);
            const dateTo = new Date(dateObject.dateTo);
            if( dateFrom <= dateToCompare && dateToCompare <= dateTo ){
                isInvalid = true;
                break;
            }
            
        }*/
        return isInvalid;
    }


    useEffect(() => {
        getDataForFields(searchParams.get("id"));
        //getInvalidDates(searchParams.get("id"));
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
                                        <PhotoExperience  nameImage={slideImage} read={true} onRemoveImage = {null}/>
                                    </Grid>
                                );
                            })
                        }
                    </Carousel>
                </Grid>
                
                <Grid container item xs={5} className={"LogoContainer"} >
                    <Grid container item xs={12} sx={{borderBottom:"1px solid black", marginBottom:"1.5rem"}}>
                        <h1 sx={{fontWeight:"bold", wordWrap:"break-word"}}>{experience.name}</h1>
                    </Grid>   
                    <Grid container item xs={12}>
                        <Container sx={{textAlign:"left"}}>
                            <h2>
                                <strong>U$D {experience.price}</strong>
                            </h2>
                            
                        </Container>
                    </Grid> 
                    <Grid container item xs={12} sx={{marginTop:"1.5rem"}}>
                        <Container sx={{textAlign:"left", border:"1px solid gray", borderRadius:"10px", backgroundColor:"lightgray", paddingTop:"5px"}}>
                            <p style={{wordWrap:"break-word"}}>{experience.description}</p> 
                        </Container>
                    </Grid>
                </Grid>
                
                <Grid container 
                     margin={10}>
                    <LocalizationProvider  dateAdapter={AdapterDayjs } >
                        <Grid container justifyContent="center"  item xs={12}>
                            <DatePicker 
                                id="checkin"
                                label="Check-In"
                                inputFormat="DD/MM/YYYY"
                                value={checkin || null}
                                onChange={(event) => {
                                    setCheckin(event);
                                }}
                                shouldDisableDate={isInvalidDateCheckIn}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </LocalizationProvider>
                </Grid>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Book this experience</Button>
                    </Container>
                
                </Grid>
                
            </Container>
        </form>

        <PaymentDialog open={showDialog} setOpen={setShowDialog} typeOfBooking="experience" paymentFunction={paymentAndReservation}/>

        <Dialog
            open={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Error: Booking not completed.
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
