import { Button, Container, TextField, Alert, AlertTitle, Collapse, CircularProgress, Grid, Input, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleUploadFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler';
import { PhotoExperience } from './PhotoExperience';
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

export const ExperiencesEdit = (exp) => {

    const [searchParams] = useSearchParams();
    const [price, setPrice] = useState(0);
    const [ExperienceName, setExperienceName] = useState('');
    const [languages, setLanguages] = useState([]);
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [photosUpload, setPhotosUpload] = useState([]);
    const [fileInputShow, setFileInputShow] = useState("");
    const [showErrorExperienceEdit, setShowErrorExperienceEdit] = useState(false);
    const [erorExperienceEdit, setErrorExperienceEdit] = useState('');
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
                name: ExperienceName,
                price: price,
                description: description,
                location: location,
                photos: photosNames
            })
        };
        const url = `${API_URL}/experiences/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        setLoadingAsync(false);
        if (response.status === 200){
            if(!jsonResponse.status_code){
                navigate('/experience/admin-my-experiences');
                window.location.reload();
            }else{
                setErrorExperienceEdit(jsonResponse.detail);
                setShowErrorExperienceEdit(true);
            }
        }
    }

    const onCloseError = (event) => {
        setShowErrorExperienceEdit(false);
        setErrorExperienceEdit('');
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
          const url = `${API_URL}/experience/${searchParams.get("id")}/photos/${nameImage}`;
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
        const url = `${API_URL}/experience/${id}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        {console.log(jsonResponse)}
        if (response.status === 200){
            if(!jsonResponse.status_code){
                setPrice(jsonResponse.message.price);
                setExperienceName(jsonResponse.message.name);
                setLocation(jsonResponse.message.location);
                setDescription(jsonResponse.message.description);
                setPhotosNamesHashed(jsonResponse.message.photos);
                setType(jsonResponse.message.type);
                setLanguages(jsonResponse.message.languages)
            }else{
                setErrorExperienceEdit(jsonResponse.detail);
                setShowErrorExperienceEdit(true);
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

    const handleLanguages = (event) => {
        const {
            target: { value },
        } = event;
        setLanguages(
            typeof value === 'string' ? value.split(',') : value,

          );
    }

  return (
    <>
        <form onSubmit = {onSubmitEdit}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorExperienceEdit}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>Experience Edit Error</strong></AlertTitle>
                            {erorExperienceEdit}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h1>Edit Your experience</h1>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Experience's Name"
                        type = "text"
                        placeholder = "Experience's name"
                        name = "experiences_name"
                        className={"inputStyle"}
                        value={ExperienceName}
                        onChange = {(event) => setExperienceName(event.target.value)}
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
                    onChange={handleLanguages}
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
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{textAlign:"left", textDecoration:"underline", marginTop:"0.75rem"}}>
                        <h3>Images</h3>
                    </Grid>
                    {
                        photosNamesHashed.map((value) => {
                            return(
                            <Grid key={value} item xs={4}>
                                <PhotoExperience nameImage={value} onRemoveImage = {onRemoveImage}/>
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