import { Container, Grid, CircularProgress, TextField, Button, InputAdornment } from '@mui/material';
import React from 'react';
import Property from './Property';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import "./Properties.css";


export const Properties = () => {

    const API_URL = 'http://localhost:8000';

    const [ inmuebles, setInmuebles ] = useState ( [] );
    const [ loading, setLoading ] = useState( true );
    const [ urlsImages, setUrlsImages ] = useState( [] );

    let navigate = useNavigate(); 
    const routeChange = (prop) =>{ 
      let path = `/property?id=${prop.key}`; 
      navigate(path);
    }

    async function getImagesFromFireBase( inmuebles ){
        const urlsArray = [];
        for ( let i=0; i < inmuebles.length ; i++ ){
            if(inmuebles[i].photos.length > 0){
                const url = await getFirebaseImage( 
                    `files/${inmuebles[i].photos[0]}`
                );
                urlsArray.push(url);
            }else{
                urlsArray.push("");
            }            
        }
        setUrlsImages( urlsArray );
        setInmuebles( inmuebles );
        setLoading( false );
    }


    async function getProperties(){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/properties`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayProps = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    arrayProps.push(jsonResponse[keys[i]]);
                }
                await getImagesFromFireBase(arrayProps);
            }
        }     
    }

    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    async function llamarConFiltros(){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        let url = `${API_URL}/properties?`;//&lowerPrice=${minPrice}&highestPrice=${maxPrice}&location=${location}`;
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
                const arrayProps = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    arrayProps.push(jsonResponse[keys[i]]);
                }
                await getImagesFromFireBase(arrayProps);
            }
        }     
    }

    useEffect( () => {
        getProperties();
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
                            Filtros
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
                                Precio
                            </h6>
                            <TextField 
                                label = "Minimo"
                                type = "text"
                                placeholder = "Min"
                                name = "Minimo precio"
                                className={"inputStyle"}
                                value={minPrice}
                                onChange = {(event) => setMinPrice(event.target.value)}
                                style={{width: 150, height: 50}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">U$D</InputAdornment>,
                                }}
                            />
                            <TextField 
                                label = "Maximo"
                                type = "text"
                                placeholder = "Max"
                                name = "Maximo precio"
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
                                Aplicar
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                
            </>
            <Grid container spacing={5}>
                {inmuebles.map( (prop, idx) => {
                    return (
                        <Grid 
                            style={{"marginTop":"2rem"}} 
                            item 
                            xs={4} 
                            key={`${prop.key}_${urlsImages[idx]}`} 
                            onClick={() => {routeChange(prop)}}
                            className = {"propertyCard"}
                        >
                            <Property 
                                key = {`${prop.key}_${urlsImages[idx]}`}
                                name={prop.name} 
                                owner={prop.owner} 
                                price={prop.price} 
                                description={prop.description} 
                                location={prop.location} 
                                score={prop.score} 
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
