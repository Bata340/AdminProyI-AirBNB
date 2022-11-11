import { Button, Container, TextField, Alert, AlertTitle, Collapse, Input, CircularProgress, Select  } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleUploadFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler';
import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const languagesList = [
    'Español',
    'English',
    'Italiano',
    'Français',
  ];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const ExperiencesUpload = (exp) => {

    const [price, setPrice] = useState(0);
    const [experienceName, setExperienceName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [languages, setLanguages] = useState([]);
    const [type, setType] = useState('');
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [photosUpload, setPhotosUpload] = useState([]);
    const [fileInputShow, setFileInputShow] = useState("");
    const [showErrorExperienceUpload, setShowErrorExperienceUpload] = useState(false);
    const [errorExperienceUpload, setErrorExperienceUpload] = useState('');
    const [loadingAsync, setLoadingAsync] = useState(false);
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmitUpload = async (event) => {
        event.preventDefault();
        setLoadingAsync(true);
        let photosNames = await handleUploadPhotos();
        const paramsUpload = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: experienceName,
                owner: localStorage.getItem('username'),
                price: price,
                description: description,
                location: location,
                type: type,
                score: [],
                photos: photosNames,
                languages: languages
            })
        };
        const url = `${API_URL}/experience/`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        setLoadingAsync(false);
        if (response.status === 200){
            if(!jsonResponse.status_code){
                navigate('/');
                window.location.reload();
            }else{
                setErrorExperienceUpload(jsonResponse.detail);
                setShowErrorExperienceUpload(true);
            }
        }
    }

    const onCloseError = (event) => {
        setShowErrorExperienceUpload(false);
        setErrorExperienceUpload('');
    }

    const goBackToHome = (event) => {
      navigate('/');
    }

    const handleUploadPhotos = async () => {
        const hashedNames = [];
        for ( let i=0; i<photosUpload.length; i++ ){
            hashedNames.push(await handleUploadFirebaseImage(photosUpload[i].name, photosUpload[i]) );
        }
        setPhotosNamesHashed(hashedNames);
        return hashedNames;
    }


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setLanguages(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
    }



  return (
    <>
        <form onSubmit = {onSubmitUpload}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorExperienceUpload}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>Experience Upload Error</strong></AlertTitle>
                            {errorExperienceUpload}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h1>Upload Your Experience</h1>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Experience's Name"
                        type = "text"
                        placeholder = "Experience's name"
                        name = "experiences_name"
                        className={"inputStyle"}
                        value={experienceName}
                        onChange = {(event) => setExperienceName(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Price (U$D)"
                        type = "number"
                        placeholder = "Price(U$D)"
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
                        label = "Type"
                        type = "text"
                        placeholder = "Type"
                        name = "Type"
                        className={"inputStyle"}
                        value={type}
                        onChange = {(event) => setType(event.target.value)}
                    />
                </Container>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Languages</InputLabel>
                    <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={languages}
                    onChange={handleChange}
                    input={<OutlinedInput label="Languages" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    >
                    {languagesList.map((language) => (
                        <MenuItem key={language} value={language}>
                        <Checkbox checked={languages.indexOf(language) > -1} />
                        <ListItemText primary={language} />
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
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
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Upload</Button>
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
