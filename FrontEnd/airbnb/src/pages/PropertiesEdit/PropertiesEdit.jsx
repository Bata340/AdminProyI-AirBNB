import { Button, Container, TextField, Alert, AlertTitle, Collapse, CircularProgress, Grid, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleUploadFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler';
import './PropertiesEdit.css';
import { PhotoProperty } from './PhotoProperty';


export const PropertiesEdit = (props) => {

    const [searchParams] = useSearchParams();
    const [price, setPrice] = useState(0);
    const [propertyName, setPropertyName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [photosUpload, setPhotosUpload] = useState([]);
    const [fileInputShow, setFileInputShow] = useState("");
    const [showErrorPropertyEdit, setShowErrorPropertyEdit] = useState(false);
    const [erorPropertyEdit, setErrorPropertyEdit] = useState('');
    const [loadingAsync, setLoadingAsync] = useState(false);
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmitEdit = async (event) => {
        event.preventDefault();
        setLoadingAsync(true);
        let photosNames = await handleUploadPhotos();
        const paramsUpload = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: propertyName,
                price: price,
                description: description,
                location: location,
                photos: photosNames
            })
        };
        const url = `${API_URL}/property/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        setLoadingAsync(false);
        if (response.status === 200){
            if(!jsonResponse.status_code){
                navigate('/properties/admin-my-props');
                window.location.reload();
            }else{
                setErrorPropertyEdit(jsonResponse.detail);
                setShowErrorPropertyEdit(true);
            }
        }
    }

    const onCloseError = (event) => {
        setShowErrorPropertyEdit(false);
        setErrorPropertyEdit('');
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
                setPrice(jsonResponse.message.price);
                setPropertyName(jsonResponse.message.name);
                setLocation(jsonResponse.message.location);
                setDescription(jsonResponse.message.description);
                setPhotosNamesHashed(jsonResponse.message.photos);
            }else{
                setErrorPropertyEdit(jsonResponse.detail);
                setShowErrorPropertyEdit(true);
            }
        }
    }

    useEffect(() => {
        getDataForFields(searchParams.get("id"));
    }, []);

    const handleUploadPhotos = async () => {
        const hashedNames = photosNamesHashed;
        for ( let i=0; i<photosUpload.length; i++ ){
            hashedNames.push(await handleUploadFirebaseImage(photosUpload[i].name, photosUpload[i]) );
        }
        setPhotosNamesHashed(hashedNames);
        return hashedNames;
    }

  return (
    <>
        <form onSubmit = {onSubmitEdit}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorPropertyEdit}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>Property Edit Error</strong></AlertTitle>
                            {erorPropertyEdit}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h1>Edit Your Property</h1>
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
                        id="description"
                        label="Description"
                        multiline
                        name="Description"
                        rows={5}
                        value={description}
                        className={"inputStyle"}
                        onChange = {(event) => setDescription(event.target.value)}
                    />
                </Container>
                <Grid container>
                    <Grid item xs={12} sx={{textAlign:"left", textDecoration:"underline", marginTop:"0.75rem"}}>
                        <h3>Images</h3>
                    </Grid>
                    {
                        photosNamesHashed.map((value) => {
                            return(
                            <Grid key={value} item xs={4}>
                                <PhotoProperty nameImage={value} onRemoveImage = {onRemoveImage}/>
                            </Grid>
                            );
                        })
                    }
                </Grid>
                <Container className={"inputClass"} style={{width:"100%"}}>
                    <Input
                        id="photosInput"
                        label="Upload Photos"
                        name="Upload Photos"
                        value={fileInputShow}
                        className={"inputStyle"}
                        inputProps = {{accept: "image/*", "multiple":true}}
                        type = "file"
                        style={{width:"100%", marginBottom: 10}}
                        onChange = {(event) => {setFileInputShow(event.target.value); setPhotosUpload(event.target.files)}}
                        
                    />
                </Container>
                {loadingAsync ? 
                    <CircularProgress/> : 
                <>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Save Changes</Button>
                    </Container>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="button" variant="contained" color="error" sx={{fontSize:16}} onClick={goBackToHome}>Cancel</Button>
                    </Container>
                </>
                }
            </Container>
        </form>
    </>
  )
}