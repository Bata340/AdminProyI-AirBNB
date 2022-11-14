import { Container, Grid, CircularProgress, TextField, Button, InputAdornment } from '@mui/material';
import React from 'react';
import Experience from './Experience';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import "./Experiences.css";


export const Experiences = () => {

    const API_URL = 'http://localhost:8000';

    const [ experiences, setExperiences ] = useState ( [] );
    const [ loading, setLoading ] = useState( true );
    const [ urlsImages, setUrlsImages ] = useState( [] );
    const [ location, setLocation ] = useState('');
    const [ minPrice, setMinPrice ] = useState('');
    const [ maxPrice, setMaxPrice ] = useState('');

    let navigate = useNavigate(); 
    const routeChange = (exp) =>{ 
      let path = `/experience?id=${exp.key}`; 
      navigate(path);
    }

    async function getImagesFromFireBase( experiences ){
        const urlsArray = [];
        for ( let i=0; i < experiences.length ; i++ ){
            if(experiences[i].photos.length > 0){
                const url = await getFirebaseImage( 
                    `files/${experiences[i].photos[0]}`
                );
                urlsArray.push(url);
            }else{
                urlsArray.push("");
            }            
        }
        setUrlsImages( urlsArray );
        setExperiences( experiences );
        setLoading( false );
    }


    async function getExperiences(){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/experiences`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayExps = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    arrayExps.push(jsonResponse[keys[i]]);
                }
                await getImagesFromFireBase(arrayExps);
            }
        }     
    }

    

    async function llamarConFiltros(){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        let url = `${API_URL}/experiences?`;
        let paramsObject = {};
        if(minPrice !== ""){
            paramsObject["lowerPrice"] = minPrice;
        }
        if(maxPrice !== ""){
            paramsObject["highestPrice"] = maxPrice;
        }
        if(location !== ""){
            paramsObject["location"] = location;
        }
        url += new URLSearchParams(paramsObject);
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayExps = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    arrayExps.push(jsonResponse[keys[i]]);
                }
                await getImagesFromFireBase(arrayExps);
            }
        }     
    }

    useEffect( () => {
        getExperiences();
    // eslint-disable-next-line
    }, []);

    return (    
        !loading ? 
        <Container >
            <>
            <Container className={"inputClass"} style={{marginTop: 50}}>
                    <Grid container style={{border:"1px solid black", borderRadius:"10px", padding:"1rem"}}>
                        <Grid item xs={12}>
                        <h4>
                            Filters
                        </h4>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <h6>
                                Location
                            </h6>
                            <TextField 
                                label = "Location"
                                type = "text"
                                placeholder = "Location"
                                name = "location"
                                className={"inputStyle"}
                                value={location}
                                onChange = {(event) => setLocation(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <h6>
                                Price
                            </h6>
                            <TextField 
                                label = "Minimum"
                                type = "text"
                                placeholder = "Min"
                                name = "Min. Price"
                                className={"inputStyle"}
                                value={minPrice}
                                onChange = {(event) => setMinPrice(event.target.value)}
                                style={{width: 150, height: 50}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">U$D</InputAdornment>,
                                }}
                            />
                            <TextField 
                                label = "Maximum"
                                type = "text"
                                placeholder = "Max"
                                name = "Max. Price"
                                className={"inputStyle"}
                                value={maxPrice}
                                onChange = {(event) => setMaxPrice(event.target.value)}
                                style={{width: 150, marginLeft: 20, height: 50}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">U$D</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button id="button-filtros" variant="outlined" onClick={llamarConFiltros} style={{marginTop:20, marginLeft: 25}}>
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                
            </>
            <Grid container spacing={5}>
                {experiences.map( (exp, idx) => {
                    return (
                        <Grid 
                            style={{"marginTop":"2rem"}} 
                            item 
                            xs={4} 
                            key={`${exp.key}_${urlsImages[idx]}`} 
                            onClick={() => {routeChange(exp)}}
                            className = {"experienceCard"}
                        >
                            <Experience 
                                key = {`${exp.key}_${urlsImages[idx]}`}
                                name={exp.name} 
                                owner={exp.owner} 
                                price={exp.price} 
                                description={exp.description} 
                                location={exp.location} 
                                photos={ urlsImages.length > idx ? urlsImages[idx]: "" }
                            />
                        </Grid>
                    )})}
            </Grid>
        </Container>
        : <CircularProgress 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            margin: 'auto',
            width: '10vw'
          }}
        />
    ) ;
}