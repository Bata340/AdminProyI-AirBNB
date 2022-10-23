import { Button, Container, TextField, Alert, AlertTitle, Collapse } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertiesUpload.css';

export const PropertiesUpload = (props) => {

    const [price, setPrice] = useState('');
    const [propertyName, setPropertyName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [showErrorPropertyUpload, setShowErrorPropertyUpload] = useState(false);
    const [errorPropertyUpload, setErrorPropertyUpload] = useState('');
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmitSignUp = async (event) => {
        event.preventDefault();
        const paramsUpload = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: propertyName,
                owner: localStorage.getItem('username'),
                price: price,
                description: description,
                location: location,
                score: 0,
                photos: photosNamesHashed
            })
        };
        const url = `${API_URL}/property/`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                navigate('/');
                window.location.reload();
            }else{
                setErrorPropertyUpload(jsonResponse.detail);
                setShowErrorPropertyUpload(true);
            }
        }
    }

    const onCloseError = (event) => {
        setShowErrorPropertyUpload(false);
        setErrorPropertyUpload('');
    }

    const goBackToHome = (event) => {
      navigate('/');
    }

  return (
    <>
        <form onSubmit = {onSubmitSignUp}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorPropertyUpload}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>SignUp Error</strong></AlertTitle>
                            {errorPropertyUpload}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h1>Alta de propiedad en alquiler</h1>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Property's Name"
                        type = "text"
                        placeholder = "Property's name"
                        name = "propertys_name"
                        className={"inputStyle"}
                        value={propertyName}
                        onChange = {(event) => setPropertyName(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Price Per Day (U$D)"
                        type = "number"
                        placeholder = "Price Per Day (U$D)"
                        name = "Price Per Day"
                        className={"inputStyle"}
                        value={price}
                        onChange = {(event) => setPrice(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Location"
                        type = "text"
                        placeholder = "Location"
                        name = "location"
                        className={"inputStyle"}
                        value={location}
                        onChange = {(event) => setLocation(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField
                        id="filled-multiline-static"
                        label="Description"
                        multiline
                        name="Description"
                        rows={5}
                        value={description}
                        className={"inputStyle"}
                        onChange = {(event) => setDescription(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <h1>ACA IRIA EL FILE EXPLORER QUE COMUNICARÍA Y SUBIRÍA A FIREBASE</h1>
                </Container>
                <Container  className={"buttonClass"} maxWidth="sm">
                    <Button type="submit" variant="contained" sx={{fontSize:16}}>Upload</Button>
                </Container>
                <Container  className={"buttonClass"} maxWidth="sm">
                    <Button type="button" variant="contained" color="error" sx={{fontSize:16}} onClick={goBackToHome}>Cancel</Button>
                </Container>
            </Container>
        </form>
    </>
  )
}
