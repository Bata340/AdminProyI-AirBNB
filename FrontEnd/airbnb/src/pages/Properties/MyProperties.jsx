import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import MyProperty from './MyProperty';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';


export const MyProperties = () => {

    const API_URL = 'http://localhost:8000';

    const [ inmuebles, setInmuebles ] = useState ( [] );
    const [ loading, setLoading ] = useState( true );
    const [ urlsImages, setUrlsImages ] = useState( [] );

    async function getImagesFromFireBase( inmuebles ){
        const urlsArray = [];
        for ( let i=0; i < inmuebles.length ; i++ ){
            console.log(inmuebles[i].photos[0])
            const url = await getFirebaseImage( 
                `files/${inmuebles[i].photos[0]}`
            );
            urlsArray.push(url);
        }
        setUrlsImages( urlsArray );
        setInmuebles( inmuebles );
        setLoading( false );
    }

    async function getUserProperties(user){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/properties?owner=${user}`;
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
                    jsonResponse[keys[i]].key = keys[i];
                    console.log(jsonResponse[keys[i]])
                    arrayProps.push(jsonResponse[keys[i]]);
                }
                //setInmuebles(arrayProps);
                await getImagesFromFireBase(arrayProps);
            }
        }     
    }


    useEffect( () => {
        getUserProperties(localStorage.getItem('username'));
    }, []);


    return (    
        !loading ? 
        <Container>
            <Grid container>
                {inmuebles.map( (prop, idx) => {
                    return (
                        <Grid style={{"marginTop":"2rem"}} item xs={4} key={`${prop.key}_${urlsImages[idx]}`}>
                            <MyProperty 
                                key={`${prop.key}_${urlsImages[idx]}`}
                                name={prop.name}AAAAAAAAAAAA 
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
