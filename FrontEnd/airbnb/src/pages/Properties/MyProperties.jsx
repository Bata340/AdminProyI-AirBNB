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

    async function getImagesFromFireBase( inmueblesVar ){
        const urlsArray = [];
        for ( let i=0; i < inmueblesVar.length ; i++ ){
            const arrayURLS = [];
            for ( let j=0; j < inmueblesVar[i].photos.length ; j++ ){
                const url = await getFirebaseImage( 
                    `files/${inmueblesVar[i].photos[j]}`
                );
                arrayURLS.push(url);
            }
            urlsArray.push(arrayURLS);
        }
        setUrlsImages( urlsArray );
        setInmuebles( inmueblesVar );
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
                    arrayProps.push(jsonResponse[keys[i]]);
                }
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
            <Grid container spacing={5}>
                {inmuebles.map( (prop, idx) => {
                    return (
                        <Grid style={{"marginTop":"2rem"}} item xs={4} key={`${prop.key}_${urlsImages[idx]}`}>
                            <MyProperty 
                                id={prop.key}
                                key={`${prop.key}_${urlsImages[idx]}`}
                                name={prop.name} 
                                owner={prop.owner} 
                                price={prop.price} 
                                description={prop.description} 
                                location={prop.location} 
                                score={prop.score} 
                                photos={ urlsImages.length > 0 ? urlsImages[idx] : []}
                                photosName = {prop.photos}
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
