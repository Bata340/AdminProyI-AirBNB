import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import Property from './Property';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';


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
            const url = await getFirebaseImage( 
                `files/${inmuebles[i].photos[0]}`
            );
            urlsArray.push(url);
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


    useEffect( () => {
        getProperties();
    // eslint-disable-next-line
    }, []);


    return (    
        !loading ? 
        <Container>
            <Grid container>
                
                {inmuebles.map( (prop, idx) => {
                    return (
                        <Grid style={{"marginTop":"2rem"}} item xs={4} key={`${prop.key}_${urlsImages[idx]}`}>
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
                            <Grid item xs={4}>
                                <Button size="small" onClick={() => {routeChange(prop)}} 
                                                    variant="contained">View
                                </Button>
                                
                            </Grid>
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
