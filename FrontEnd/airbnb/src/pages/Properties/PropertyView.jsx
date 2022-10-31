import { Button, Container, TextField, Alert, AlertTitle, Collapse, CircularProgress, Grid, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleUploadFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler';
//import './PropertiesEdit.css';
import { PhotoProperty } from '../PropertiesEdit/PhotoProperty';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';



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

    const onRemoveImage = async( nameImage ) => {
        const paramsDelete = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
          };
          const url = `${API_URL}/property/${searchParams.get("id")}/photos/${nameImage}`;
          const response = await fetch(
              url,
              paramsDelete
          );
          const jsonResponse = await response.json();
          if (response.status === 200){
              if(!jsonResponse.status_code){
                await deleteFirebaseImage( `files/${nameImage}` );
                setPhotosNamesHashed( photosNamesHashed.filter( element => element !== nameImage ) );
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

    useEffect(() => {
        getDataForFields(searchParams.get("id"));
    }, []);



  return (
    <>
        <form onSubmit = {onSubmit}>
            
            <Container    spacing={12}  sx={{ width: '80%' }} id="formWrapper">

                <Grid container item xs={1} className={"buttonClass"} marginBottom={5}>
                        <Button type="button" variant="contained" color="error"   onClick={goBackToHome}>Back</Button>
                </Grid>
                <Grid container item xs={12}>
                <Grid container item xs={6}>
                    
                    {
                        photosNamesHashed.map((value) => {
                            return(
                            <Grid key={value} item >
                                <PhotoProperty nameImage={value} read={true} onRemoveImage = {onRemoveImage}/>
                            </Grid>
                            );
                        })
                    }
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