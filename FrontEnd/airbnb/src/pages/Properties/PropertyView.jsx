import { Button, Container, TextField, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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

    const [showErrorPropertyEdit, setShowErrorPropertyEdit] = useState(false);
    const [erorPropertyEdit, setErrorPropertyEdit] = useState('');


    const [checkin, setCheckin] = useState(dayjs(''));
    const [checkout, setCheckout] = useState(dayjs(''));
    const [property, setProperty] = useState('');

    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmit = async (event) => {

    }

    const goBackToHome = (event) => {
      navigate('/');
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

    useEffect(() => {
        getDataForFields(searchParams.get("id"));
    }, []);



  return (
    <>
        <form onSubmit = {onSubmit}>
            
            <Container spacing={12}  sx={{ width: '80%' }} id="formWrapper">

                <Grid container item xs={1} className={"buttonClass"} marginBottom={5}>
                        <Button type="button" variant="contained" color="error"   onClick={goBackToHome}>Back</Button>
                </Grid>
                <Grid container item xs={12}>
                <Grid container item xs={6}>
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
                    <Grid container item xs={12}>
                    <h1>Property: {property.name}</h1>
                    </Grid>   
                    <Grid container item xs={12}>
                    <h2  >Price: {property.price}/nigth </h2>
                    </Grid> 
                    <Grid container item xs={12} >
                    <h3  style={{fontSize:"20px"}}>Score: {property.score}</h3>
                    </Grid> 
                    <Grid container item xs={12}>
                    <p  >{property.description}</p> 
                    </Grid> 
                    
                    
                    
                </Grid>
                
                <Grid container 
                     margin={10}>
                    <LocalizationProvider  dateAdapter={AdapterDayjs } >
                    <Grid container justifyContent="center"  item xs={6}>
                        <DesktopDatePicker 
                        id="checkin"
                        label="Check-In"
                        inputFormat="MM/DD/YYYY"
                        value={checkin}
                        onChange={(event) => setCheckin(event)}
                        
                        renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid container justifyContent="center"  item xs={6}>
                        <DesktopDatePicker
                            id="checkout"
                            label="Checkout"
                            inputFormat="MM/DD/YYYY"
                            value={checkout}
                            onChange={(event) => setCheckout(event)}
                            
                            renderInput={(params) => <TextField {...params} />}
                            />
                    </Grid>
                        
                    
                    </LocalizationProvider>
                </Grid>
                
                
                
                
                
                
                <>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Reserve</Button>
                    </Container>
                    
                </>
                
                </Grid>
                
            </Container>
        </form>
    </>
  )
}